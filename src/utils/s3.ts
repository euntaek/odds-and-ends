import AWS from 'aws-sdk';
import { StorageEngine } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';

import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} from '@/constans';

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: AWS_REGION,
});

export const s3Storage = (id: string, fieldName: string): StorageEngine =>
  multerS3({
    s3,
    bucket: AWS_S3_BUCKET_NAME,
    key: (req, file, done) => {
      const ext = path.extname(file.originalname);
      const originalImgName = path.basename(file.originalname, ext);
      const refinedImgName = `${originalImgName}.${Date.now()}${ext}`;
      done(null, `${id}/images/${fieldName}/${refinedImgName}`);
    },
  });
