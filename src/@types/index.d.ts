import { File } from '@koa/multer';
import { ReturnData } from './return';
import { ErroInfo } from './error';

declare global {
  interface UserInfo {
    _id: string;
    email: string;
    username: string;
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

  interface S3File extends File {
    location?: stirng;
  }
}
