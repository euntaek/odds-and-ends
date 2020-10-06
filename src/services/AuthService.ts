import User from '../entity/User';
import EmailAuth from '../entity/EmailAuth';
import { setEncryptionPassword, generateToken } from '../lib/auth';

interface IAuthService {
  createOneUser(registerData: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<UserInfo>;
  getOneUser(email: string): Promise<User | undefined>;
  createOneEmailAuth(type: 'register', email: string): Promise<EmailAuth>;
  getOneEmailAuth(token: string): Promise<EmailAuth | undefined>;
  findOneEmail(email: string): Promise<boolean>;
  findOneDisplayName(displayName: string): Promise<boolean>;
  userCertification(email: string): Promise<boolean>;
}

const AuthService: IAuthService = {
  async createOneUser({ email, displayName, password }) {
    const user = {
      email: email,
      displayName: displayName,
      hashedPassword: await setEncryptionPassword(password),
    };
    return await User.createOne(user);
  },
  async getOneUser(email) {
    return await User.getOneByOptions({ email });
  },
  async createOneEmailAuth(type, email) {
    const authToken = generateToken();
    return await EmailAuth.createOne(type, email, authToken);
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
    if (!user) return false;

    user.isCertified = true;
    await user.save();
    return true;
  },
};

export default AuthService;
