import multer, { Multer } from 'multer';
import { Storage } from '@google-cloud/storage';
import MulterGoogleCloudStorage from 'multer-google-storage';
import { Request } from 'express';

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;

if (!GCS_BUCKET_NAME) {
  throw new Error('GCS_BUCKET_NAME environment variable is not set.');
}

const storage = new MulterGoogleCloudStorage({
  bucket: GCS_BUCKET_NAME,
  acl: 'publicRead',
  // --- CHANGES ARE HERE ---
  filename: (
    _req: Request, // Ignore the unused 'req' parameter
    file: Express.Multer.File, 
    cb: (error: Error | null, filename: string) => void // Explicitly type the callback
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload: Multer = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

export default upload;