import { ReturnData } from './return';
import { ErroInfo } from './error';

declare global {
  interface UserInfo {
    _id: string;
    email: string;
    username: string;
    is_confirmed: boolean;
    profile: {
      _id: string;
      display_name: string;
      thumbnail: string;
    };
  }
  interface UserToken {
    accessToken: string;
    refreshToken: string;
  }
  interface LoginData extends UserToken {
    user: UserInfo;
  }
  interface ServiceData<T = any> extends ReturnData<T> {}
  interface ErrorParams extends ErroInfo {}
}
