import AWS from 'aws-sdk';
import multer from '@koa/multer';
import multerS3 from 'multer-s3';
import path from 'path';

import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} from '../constans';

const BUKET_PATH = 'temp';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const s3Storage = multerS3({
  s3,
  bucket: AWS_S3_BUCKET_NAME,
  key: (req, file, done) => {
    const ext = path.extname(file.originalname);
    const originalImgName = path.basename(file.originalname, ext);
    const refinedImgName = `${originalImgName}.${Date.now()}${ext}`;
    done(null, `${BUKET_PATH}/${refinedImgName}`);
  },
});

const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB

// Error: StorageEngine' is not assignable to type
// node_modules/@types/multer 삭제를 하거나 multer를 사용 안하면 됨.
export const multerInstance = multer({ storage: s3Storage, limits });
