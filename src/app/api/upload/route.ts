
// src/app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/lib/s3Client';
import formidable, { type File as FormidableFile } from 'formidable';
import fs from 'fs';
import { Upload } from "@aws-sdk/lib-storage";
import type { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";


export async function POST(req: NextRequest) {
  if (!process.env.SUFY_BUCKET_NAME) {
    return NextResponse.json({ error: "Sufy bucket name is not configured." }, { status: 500 });
  }
  if (!process.env.SUFY_PUBLIC_URL_PREFIX) {
    return NextResponse.json({ error: "Sufy public URL prefix is not configured." }, { status: 500 });
  }
  
  const bucketName = process.env.SUFY_BUCKET_NAME;
  const rawSufyUrlPrefix = process.env.SUFY_PUBLIC_URL_PREFIX;
  const publicUrlPrefix = rawSufyUrlPrefix.endsWith('/') 
    ? rawSufyUrlPrefix 
    : `${rawSufyUrlPrefix}/`;

  try {
    const formidableReq = {
      ...req,
      headers: Object.fromEntries(req.headers),
      on: (...args: any[]) => (req.body as any)?.on(...args),
      emit: (...args: any[]) => (req.body as any)?.emit(...args),
    } as any;

    const form = formidable({ multiples: false });

    const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
        form.parse(formidableReq, (err, fields, files) => {
          if (err) {
            console.error("Formidable parsing error:", err);
            return reject(err);
          }
          resolve({ fields, files });
        });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file) {
      return NextResponse.json({ error: 'No file found in the upload.' }, { status: 400 });
    }

    const fileStream = fs.createReadStream(file.filepath);
    const originalFilename = file.originalFilename || `file-${Date.now()}`;
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueKey = `${Date.now()}-${sanitizedFilename}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: uniqueKey,
        Body: fileStream,
        ACL: 'public-read', // Ensure files are publicly readable
        ContentType: file.mimetype || undefined,
      },
    });

    const result = await upload.done() as CompleteMultipartUploadCommandOutput;
    
    // Check if upload was successful (ETag is a good indicator for S3-like services)
    if (!result.ETag) {
        throw new Error("Upload to Sufy failed, ETag not found.");
    }

    const fileUrl = `${publicUrlPrefix}${uniqueKey}`;

    // Clean up the temporary file created by formidable
    fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
            console.error("Error deleting temporary file:", unlinkErr);
            // Not a fatal error for the upload itself, but good to log
        }
    });

    return NextResponse.json({ message: 'Uploaded!', fileUrl: fileUrl }, { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed due to an internal error.';
    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
  }
}
