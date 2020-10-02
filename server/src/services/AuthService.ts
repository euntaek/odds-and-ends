import User from '../entity/User';
import EmailAuth from '../entity/EmailAuth';
import { setPasswordEncryption } from '../lib/auth';
import { ErrorParmas } from '../errors/errRequest';

interface IAuthService {
  createOneUser(registerData: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<UserInfo>;
  createOneEmailAuth(type: 'register', email: string, token: string): Promise<EmailAuth>;
  getOneEmailAuth(token: string): Promise<EmailAuth | undefined>;
  findOneEmail(email: string): Promise<boolean>;
  findOneDisplayName(displayName: string): Promise<boolean>;
  userCertification(email: string): Promise<{ success: boolean; error: ErrorParmas | null }>;
}

const AuthService: IAuthService = {
  async createOneUser({ email, displayName, password }) {
    const user = {
      email: email,
      displayName: displayName,
      hashedPassword: await setPasswordEncryption(password),
    };
    return await User.createOne(user);
  },
  async createOneEmailAuth(type, email, token) {
    return await EmailAuth.createOne(type, email, token);
  },
  async getOneEmailAuth(token) {
    return await EmailAuth.getOneByToken(token);
  },
  async findOneEmail(email) {
    const user = await User.getOneByOptions({ email });
    console.log(user);
    return user ? true : false;
  },
  async findOneDisplayName(displayName) {
    const user = await User.getOneByOptions({ displayName });
    return user ? true : false;
  },
  async userCertification(email) {
    const user = await User.getOneByOptions({ email });
    if (!user)
      return {
        success: false,
        error: { message: '존재하지 않는 사용자', loaction: 'auth.userCertification' },
      };
    user.isCertified = true;
    await user.save();
    return { success: true, error: null };
  },
};

export default AuthService;
