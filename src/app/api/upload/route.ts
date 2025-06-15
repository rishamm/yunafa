
// src/app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/lib/s3Client';
import formidable, { type File as FormidableFile, errors as formidableErrors } from 'formidable';
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

  const form = formidable({ multiples: false });

  try {
    const [fields, filesRecord] = await form.parse(req as any); // req can often be passed directly to formidable v3

    const fileEntry = filesRecord.file; // 'file' is the expected field name from the client
    
    let file: FormidableFile | undefined;
    if (Array.isArray(fileEntry)) {
        file = fileEntry[0];
    } else {
        file = fileEntry;
    }

    if (!file) {
      return NextResponse.json({ error: 'No file found in the upload. Expected field name "file".' }, { status: 400 });
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
        ACL: 'public-read', 
        ContentType: file.mimetype || undefined,
      },
    });

    const result = await upload.done() as CompleteMultipartUploadCommandOutput;
    
    if (!result.ETag) {
        throw new Error("Upload to Sufy failed, ETag not found in response.");
    }

    const fileUrl = `${publicUrlPrefix}${uniqueKey}`;

    // Asynchronously delete the temporary file, don't wait for it
    fs.unlink(file.filepath, (unlinkErr) => {
        if (unlinkErr) {
            console.error("Error deleting temporary file:", unlinkErr.message);
        }
    });

    return NextResponse.json({ message: 'Uploaded!', fileUrl: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Upload API error details:', error); 

    if (error instanceof formidableErrors.FormidableError) {
        return NextResponse.json({ error: 'Error parsing form data.', details: error.message, code: error.internalCode }, { status: 400 });
    }
    
    let clientErrorMessage = 'Upload failed due to an internal server error.';
    // Check if error.message is a string and does not look like HTML/XML
    if (error.name && error.message && typeof error.message === 'string' && !error.message.trim().startsWith('<')) {
        clientErrorMessage = `Upload failed: ${error.name}. ${error.message.substring(0, 200)}`; // Truncate long messages
    } else if (error.name) {
        clientErrorMessage = `Upload failed: ${error.name}. Check server logs for details.`;
    }
    
    // Also log the filepath if it exists and we are in a state where fs.unlink might be needed
    // This part is tricky because 'file' might not be defined if 'form.parse' failed.
    // Consider cleaning up temp files more robustly if formidable itself errors out.
    // For now, the fs.unlink is within the try block for successful parses.

    return NextResponse.json({ error: clientErrorMessage, originalErrorName: error.name }, { status: 500 });
  }
}

