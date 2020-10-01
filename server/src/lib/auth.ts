import bcrypt from 'bcrypt';
import crypto from 'crypto';

// password 암호화
export const setPasswordEncryption = async (password: string): Promise<string> => {
  const SALT_OR_ROUNDS = 10;
  return await bcrypt.hash(password, SALT_OR_ROUNDS);
};

// 토큰생성
export const generateToken = (): string => crypto.randomBytes(32).toString('hex');
