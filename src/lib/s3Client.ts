// src/lib/s3Client.ts
import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.SUFY_ENDPOINT) {
  throw new Error('Please define the SUFY_ENDPOINT environment variable (e.g., https://mos.sufycloud.com)');
}
if (!process.env.SUFY_REGION) {
  throw new Error('Please define the SUFY_REGION environment variable (e.g., us-east-1)');
}
if (!process.env.SUFY_ACCESS_KEY) {
  throw new Error('Please define the SUFY_ACCESS_KEY environment variable');
}
if (!process.env.SUFY_SECRET_KEY) {
  throw new Error('Please define the SUFY_SECRET_KEY environment variable');
}


export const s3 = new S3Client({
  endpoint: process.env.SUFY_ENDPOINT,
  region: process.env.SUFY_REGION,
  credentials: {
    accessKeyId: process.env.SUFY_ACCESS_KEY,
    secretAccessKey: process.env.SUFY_SECRET_KEY,
  },
  forcePathStyle: true, // Important for S3 compatible services like Sufy
});
