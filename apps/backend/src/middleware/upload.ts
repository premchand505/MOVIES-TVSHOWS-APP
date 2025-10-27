import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { Request } from 'express';

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID; // We need this

if (!GCS_BUCKET_NAME || !GCP_PROJECT_ID) { // Check for both
  throw new Error('GCS_BUCKET_NAME or GCP_PROJECT_ID environment variable is not set.');
}

// Explicitly create a new GCS client instance with the Project ID
const gcs = new Storage({
  projectId: GCP_PROJECT_ID,
});

const storage = new MulterGoogleCloudStorage({
  bucket: GCS_BUCKET_NAME,
  storage: gcs,
  acl: 'publicRead',
  filename: (
    _req: Request,
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

export default upload;