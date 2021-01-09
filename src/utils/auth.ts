// import bcrypt from 'bcrypt';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

// password 암호화
export const hashPssword = async (password: string): Promise<string> => {
  const SALT_OR_ROUNDS = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, SALT_OR_ROUNDS);
};

// token 생성
export const generateRandomToken = (): string => crypto.randomBytes(32).toString('hex');

// JWT 생성
export const generateJWT = async (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  payload: any,
  secretKey: Secret,
  options: SignOptions,
): Promise<string> => {
  const signOptions: SignOptions = {
    issuer: '160chars.com',
    ...options,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, signOptions, (err, encoded) => {
      if (err) reject(err);
      resolve(encoded as string);
    });
  });
};
