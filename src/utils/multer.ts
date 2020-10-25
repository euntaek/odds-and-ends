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

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, 'src/public/images');
  },
  filename(req, file, done) {
    const ext = path.extname(file.originalname);
    const imageName = path.basename(file.originalname, ext);
    done(null, `${imageName}.${Date.now()}${ext}`);
  },
});

const limits = { fileSize: 4 * 1024 * 1024 }; // 4MB

export const multerInstance = multer({ storage, limits });
