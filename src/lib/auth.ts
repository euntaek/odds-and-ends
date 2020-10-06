import { RouterContext } from '@koa/router';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';

const { SECRET_KEY } = process.env;

// password 암호화
export const setEncryptionPassword = async (password: string): Promise<string> => {
  const SALT_OR_ROUNDS = 10;
  return await bcrypt.hash(password, SALT_OR_ROUNDS);
};

// token 생성
export const generateToken = (): string => crypto.randomBytes(32).toString('hex');

// JWT 생성
interface IPayload {
  _id: string;
  email?: string;
  displayName?: string;
  isCertified?: boolean;
}
export const generateJWT = async (payload: IPayload, options?: SignOptions): Promise<string> => {
  const signOptions: SignOptions = {
    issuer: '200char.com',
    expiresIn: '7d',
    ...options,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY ?? '', signOptions, (err, encoded) => {
      if (err) reject(err);
      resolve(encoded);
    });
  });
};

export const setTokenCookie = (ctx: RouterContext, token: string): void => {
  ctx.cookies.set('access_token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true,
    // sameSite: 'lax',
  });
};
