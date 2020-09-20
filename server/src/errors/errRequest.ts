import { StatusCodes } from 'http-status-codes';

interface IErrorsBody {
  location?: string;
  error?: string;
}

export abstract class RequestError extends Error {
  statusCode: number;
  detail?: IErrorsBody;
  log?: any;
  constructor(message?: string) {
    super(message);
  }
}

export class InternalServerError extends RequestError {
  constructor(errorParams?: { location?: string; error?: string; log?: any }) {
    super('서버 오류입니다.');
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    if (errorParams) {
      this.detail = { location: errorParams.location, error: errorParams.error };
      this.log = errorParams.log;
    }
  }
}

export class BadRequest extends RequestError {
  constructor(errorParams?: { location?: string; error?: string; log?: any }) {
    super('유효하지 않은 요청입니다.');
    this.statusCode = StatusCodes.BAD_REQUEST;
    if (errorParams) {
      this.detail = { location: errorParams.location, error: errorParams.error };
      this.log = errorParams.log;
    }
  }
}

export class NotFound extends RequestError {
  constructor(errorParams?: { location?: string; error?: string; log?: any }) {
    super('리소스가 존재하지 않습니다.');
    this.statusCode = StatusCodes.NOT_FOUND;
    if (errorParams) {
      this.detail = { location: errorParams.location, error: errorParams.error };
      this.log = errorParams.log;
    }
  }
}
