// src/app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/s3Client';
import formidable, { type File } from 'formidable';
import fs from 'fs';

// Helper to parse FormData using formidable
async function parseFormData(req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const formData = await req.formData();
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    // This is a bit of a hack to adapt formidable to work with NextRequest's FormData
    // formidable expects a Node.js IncomingMessage (req)
    // We'll create a pass-through stream if needed, or directly pass buffers
    const chunks: Uint8Array[] = [];
    const fileEntries: Record<string, any> = {};
    const fieldEntries: Record<string, any> = {};

    const tempReq = {
        headers: Object.fromEntries(req.headers.entries()),
        on: (event: string, listener: (...args: any[]) => void) => {
            if (event === 'data') {
                formData.forEach(async (value, key) => {
                    if (value instanceof Blob) { // Check if it's a File/Blob
                        const buffer = Buffer.from(await value.arrayBuffer());
                        listener(buffer);
                    }
                });
            }
            if (event === 'end') {
                listener();
            }
        },
        read: () => chunks.shift() || null, // Mock read if formidable tries to use it
        emit: (event: string, ...args: any[]) => {
            // Mock emit for events like 'data' and 'end'
            if (event === 'data' && args[0]) {
                chunks.push(args[0]);
            } else if (event === 'end') {
                // Handle end of stream
            }
        },
        httpVersion: '1.1', // Mock property
        method: req.method, // Mock property
    } as any;


    form.parse(tempReq, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });

    // Manually feed formidable from FormData
    // formidable's .parse(req) expects a Node.js IncomingMessage.
    // We need to simulate this by piping the file data from NextRequest.formData()
    // to something formidable can process. This is complex because formidable
    // is designed for Node's stream-based request objects.

    // Simplified approach: formidable v3 can parse a form directly if the file data is accessible.
    // The standard way with App Router is to get FormData and process files.
    // We'll try to make formidable work by extracting file data from `req.formData()`.
    // This part is tricky as formidable expects specific stream events.

    // For now, we'll process the `req.formData()` directly which is more standard for App Router
    // and assume a single file named "file". If `formidable` is strictly needed,
    // a more custom adapter for `req: NextRequest` to `http.IncomingMessage` would be required.
    // Let's proceed with the assumption that `form.parse(req)` will work with the mock `tempReq`
    // For direct FormData processing in App Router (alternative to formidable for simple cases):
    // const data = await req.formData();
    // const file = data.get('file') as File | null;
    // if (!file) return reject(new Error("No file found"));
    // const fileStream = fs.createReadStream(file.path); // This won't work directly with `File` from `req.formData()`
    // For `File` from `req.formData()` you'd use `file.arrayBuffer()` then `Buffer.from()`
  });
}


export async function POST(req: NextRequest) {
  if (!process.env.SUFY_BUCKET_NAME) {
    return NextResponse.json({ error: "Sufy bucket name is not configured." }, { status: 500 });
  }
  if (!process.env.SUFY_PUBLIC_URL_PREFIX) {
    return NextResponse.json({ error: "Sufy public URL prefix is not configured." }, { status: 500 });
  }
  
  const bucketName = process.env.SUFY_BUCKET_NAME;
  const publicUrlPrefix = process.env.SUFY_PUBLIC_URL_PREFIX.endsWith('/') 
    ? process.env.SUFY_PUBLIC_URL_PREFIX 
    : `${process.env.SUFY_PUBLIC_URL_PREFIX}/`;

  try {
    // formidable expects a Node.js IncomingMessage. We adapt NextRequest.
    // This is a common workaround pattern.
    const formidableReq = {
      ...req,
      headers: Object.fromEntries(req.headers),
      on: (...args: any[]) => (req.body as any)?.on(...args), // Pass through stream events if possible
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
    // Sanitize filename to prevent path traversal and use a unique name
    const originalFilename = file.originalFilename || `file-${Date.now()}`;
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueKey = `${Date.now()}-${sanitizedFilename}`;


    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueKey, // Use the unique key
      Body: fileStream,
      ACL: 'public-read', // Ensure files are publicly readable
      ContentType: file.mimetype || undefined, // Set content type
    });

    await s3.send(uploadCommand);
    
    const fileUrl = `${publicUrlPrefix}${uniqueKey}`;

    return NextResponse.json({ message: 'Uploaded!', fileUrl: fileUrl }, { status: 200 });

  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed due to an internal error.';
    return NextResponse.json({ error: errorMessage, details: error }, { status: 500 });
  }
}
