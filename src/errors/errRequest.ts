import { StatusCodes } from 'http-status-codes';

export abstract class RequestError extends Error {
  statusCode: number;
  error?: any;
  constructor(message?: string) {
    super(message);
  }
}
export class InternalServerError extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message || '내부 서버 오류입니다.');
      this.error = errorData?.error;
    }
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export class BadRequest extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message || '잘못 된 요청입니다.');
      this.error = errorData?.error;
    }
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NotFound extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message || '리소스가 존재하지 않습니다.');
      this.error = errorData?.error;
    }
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class Conflict extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message || '리소스 충돌');
      this.error = errorData?.error;
    }
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export class Unauthorized extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message || '권한이 없습니다.');
      this.error = errorData?.error;
    }
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
