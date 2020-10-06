import { StatusCodes } from 'http-status-codes';

export interface ErrorParmas {
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
    super(errorParams?.message || '내부 서버 오류입니다.');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export class BadRequest extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '잘못 된 요청입니다.');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NotFound extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '리소스가 존재하지 않습니다.');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class Conflict extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '리소스 충돌');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.CONFLICT;
  }
}
export class Unauthorized extends RequestError {
  constructor(errorParams?: ErrorParmas) {
    super(errorParams?.message || '권한이 없습니다.');
    this.log = errorParams?.log;
    this.location = errorParams?.location;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
