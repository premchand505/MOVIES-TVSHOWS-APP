import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { Request } from 'express';

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;

if (!GCS_BUCKET_NAME) {
  throw new Error('GCS_BUCKET_NAME environment variable is not set.');
}

// 1. Explicitly create a new GCS client instance.
// When running on GCP, this constructor automatically finds the project ID and credentials.
const gcs = new Storage();

// 2. Configure multer-google-storage with the explicit client instance.
const storage = new MulterGoogleCloudStorage({
  bucket: GCS_BUCKET_NAME,
  storage: gcs, // <-- Pass the initialized client here
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