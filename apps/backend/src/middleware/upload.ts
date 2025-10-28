import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;

if (!GCS_BUCKET_NAME || !GCP_PROJECT_ID) {
  throw new Error('GCS_BUCKET_NAME or GCP_PROJECT_ID environment variable is not set.');
}

// 1. Explicitly create a new GCS client instance
const gcs = new Storage({
  projectId: GCP_PROJECT_ID,
});

const bucket = gcs.bucket(GCS_BUCKET_NAME);

// 2. Configure Multer to use memory storage
// This stores the file as a Buffer in req.file.buffer
const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

// 3. Create our new custom middleware for GCS upload
const uploadToGcs = (req: Request, res: Response, next: NextFunction) => {

  // If no file is present, or if it's an update and the poster isn't being changed, skip to the next middleware.
  if (!req.file) {
    return next();
  }

  // Create a new blob in the bucket
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const extension = path.extname(req.file.originalname);
  const blobName = `${req.file.fieldname}-${uniqueSuffix}${extension}`;
  
  const blob = bucket.file(blobName);

  // Create a write stream to the blob
  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  blobStream.on('error', (err) => {
    // Pass any GCS error to the global error handler
    err.message = `Error uploading to GCS: ${err.message}`;
    next(err);
  });

  blobStream.on('finish', () => {
    // The file upload is complete.

    // Make the file public (if  bucket is private by default)
    blob.makePublic().then(() => {
      // Create the public URL


      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      
      // IMPORTANT: Overwrite req.file.path with the public GCS URL.
      // Your movieController already reads from (req.file as any).path
     
      (req.file as any).path = publicUrl;
      
      // All good, move to the next middleware (the controller)
      next();
    }).catch(err => {
      err.message = `Error making file public: ${err.message}`;
      next(err);
    });
  });

  // End the stream by writing the file's buffer
  blobStream.end(req.file.buffer);
};

// 4. Export both middlewares
export { multerUpload, uploadToGcs };