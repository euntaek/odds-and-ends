import { ErroInfo } from './error';

export interface ReturnData<T> {
  success: boolean;
  error?: ErroInfo;
  data?: T;
}
