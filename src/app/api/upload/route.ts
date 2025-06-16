
// src/app/api/upload/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { s3 } from '@/lib/s3Client';
import formidable, { type File as FormidableFile, errors as formidableErrors } from 'formidable';
import fs from 'fs';
import { Upload } from "@aws-sdk/lib-storage";
import type { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";


export async function POST(req: NextRequest) {
  // Log all required Sufy env vars to check if they are available in this environment
  console.log("API Upload - SUFY_BUCKET_NAME:", process.env.SUFY_BUCKET_NAME ? "SET" : "NOT SET");
  console.log("API Upload - SUFY_PUBLIC_URL_PREFIX:", process.env.SUFY_PUBLIC_URL_PREFIX ? "SET" : "NOT SET");
  console.log("API Upload - SUFY_ENDPOINT:", process.env.SUFY_ENDPOINT ? "SET" : "NOT SET");
  console.log("API Upload - SUFY_REGION:", process.env.SUFY_REGION ? "SET" : "NOT SET");
  console.log("API Upload - SUFY_ACCESS_KEY:", process.env.SUFY_ACCESS_KEY ? "SET (exists)" : "NOT SET");
  console.log("API Upload - SUFY_SECRET_KEY:", process.env.SUFY_SECRET_KEY ? "SET (exists)" : "NOT SET");

  if (!process.env.SUFY_BUCKET_NAME) {
    console.error('API Upload Error: Sufy bucket name is not configured.');
    return NextResponse.json({ error: "Sufy bucket name is not configured.", details: "Server configuration missing SUFY_BUCKET_NAME." }, { status: 500 });
  }
  if (!process.env.SUFY_PUBLIC_URL_PREFIX) {
    console.error('API Upload Error: Sufy public URL prefix is not configured.');
    return NextResponse.json({ error: "Sufy public URL prefix is not configured.", details: "Server configuration missing SUFY_PUBLIC_URL_PREFIX." }, { status: 500 });
  }
  if (!process.env.SUFY_ENDPOINT || !process.env.SUFY_REGION || !process.env.SUFY_ACCESS_KEY || !process.env.SUFY_SECRET_KEY) {
    console.error('API Upload Error: Sufy S3 client configuration is incomplete. One or more required SUFY_ENDPOINT, SUFY_REGION, SUFY_ACCESS_KEY, SUFY_SECRET_KEY variables are missing.');
    return NextResponse.json({ error: "Sufy S3 client configuration incomplete.", details: "Server configuration missing one or more SUFY_ENDPOINT, SUFY_REGION, SUFY_ACCESS_KEY, SUFY_SECRET_KEY." }, { status: 500 });
  }
  
  const bucketName = process.env.SUFY_BUCKET_NAME;
  const rawSufyUrlPrefix = process.env.SUFY_PUBLIC_URL_PREFIX;
  const publicUrlPrefix = rawSufyUrlPrefix.endsWith('/') 
    ? rawSufyUrlPrefix 
    : `${rawSufyUrlPrefix}/`;

  const form = formidable({ multiples: false });
  let tempFilepath: string | undefined;

  try {
    const [fields, filesRecord] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fieldsFromCallback, filesFromCallback) => {
            if (err) {
                console.error("Formidable parsing error inside promise:", err);
                reject(err);
                return;
            }
            resolve([fieldsFromCallback, filesFromCallback]);
        });
    });

    const fileEntry = filesRecord.file;
    let file: FormidableFile | undefined;
    if (Array.isArray(fileEntry)) {
        file = fileEntry[0];
    } else {
        file = fileEntry;
    }

    if (!file) {
      console.error('API Upload Error: No file found in the upload. Expected field name "file".');
      return NextResponse.json({ error: 'No file found in the upload.', details: "The 'file' field was missing from the form data." }, { status: 400 });
    }
    
    tempFilepath = file.filepath; 

    const fileStream = fs.createReadStream(file.filepath);
    const originalFilename = file.originalFilename || `file-${Date.now()}`;
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const uniqueKey = `${Date.now()}-${sanitizedFilename}`;

    console.log(`Attempting to upload ${originalFilename} as ${uniqueKey} to bucket ${bucketName}`);

    const upload = new Upload({
      client: s3, // s3 client from @/lib/s3Client
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
        console.error("API Upload Error: Upload to Sufy S3 compatible storage failed, ETag not found in response.", result);
        return NextResponse.json({ error: "Upload to storage service failed.", details: "ETag not found in response from storage service." }, { status: 500 });
    }

    const fileUrl = `${publicUrlPrefix}${uniqueKey}`;
    console.log(`File uploaded successfully: ${fileUrl}`);
    
    return NextResponse.json({ message: 'Uploaded!', fileUrl: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Full API Upload Error in POST route catch block:', error); 

    let errorMessage = 'An unexpected error occurred during file upload.';
    let errorDetails: string | Record<string, unknown> = 'Check server logs for more information.';
    let statusCode = 500;

    if (error instanceof formidableErrors.FormidableError || error.constructor.name === 'FormidableError') {
        errorMessage = 'Error parsing form data.';
        errorDetails = error.message; 
        statusCode = (error as any).httpCode || 400;
        console.error(`Formidable Error (Code: ${(error as any).internalCode || 'N/A'}): ${error.message}`);
    } else if (error.name && typeof error.message === 'string') { // AWS SDK V3 errors
        errorMessage = `Storage operation failed: ${error.name}.`;
        errorDetails = error.message.substring(0, 300); 
        if (error.$metadata && error.$metadata.httpStatusCode) {
            statusCode = error.$metadata.httpStatusCode;
        }
        console.error(`S3 Client or other library error: ${error.name} - ${error.message}`);
    } else if (typeof error.message === 'string') {
        errorDetails = error.message.substring(0, 300);
        console.error(`Generic error (message only): ${error.message}`);
    } else {
        console.error('Generic error (object):', error);
    }

    return NextResponse.json({ error: errorMessage, details: errorDetails, originalErrorName: error.name || 'UnknownError' }, { status: statusCode });
  } finally {
    if (tempFilepath) {
        fs.unlink(tempFilepath, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Error deleting temporary file in finally block:", unlinkErr.message, tempFilepath);
            } else {
                console.log("Temporary file deleted successfully in finally block:", tempFilepath);
            }
        });
    }
  }
}

