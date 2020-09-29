import { DeepPartial } from 'typeorm';
import bcrypt from 'bcrypt';

import User from '../entity/User';

interface IAuthService {
  createOneUser(userData: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<DeepPartial<User>>;
  setPasswordEncryption(password: string): Promise<string>;
}

const AuthService: IAuthService = {
  async createOneUser(userData) {
    const user = {
      email: userData.email,
      displayName: userData.displayName,
      hashedPassword: await this.setPasswordEncryption(userData.password),
    };
    return await User.createOne(user);
  },

  async setPasswordEncryption(password) {
    const SALT_OR_ROUNDS = 10;
    return await bcrypt.hash(password, SALT_OR_ROUNDS);
  },
};

export default AuthService;
