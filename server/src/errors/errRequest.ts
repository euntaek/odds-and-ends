import { StatusCodes } from 'http-status-codes';

interface ErrorParmas {
  message?: string;
  location?: string;
  log?: any;
}
export abstract class RequestError extends Error {
  statusCode: number;
  location?: string;
  log?: any;
  constructor(message?: string) {
    super(message);
  }
}
export class InternalServerError extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '내부 서버 오류');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export class BadRequest extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '유효하지 않은 요청');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NotFound extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '리소스가 존재하지 않음');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
