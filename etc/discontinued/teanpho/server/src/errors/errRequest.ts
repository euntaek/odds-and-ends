import { StatusCodes } from 'http-status-codes';

export abstract class RequestError extends Error {
  statusCode: number;
  name: string;
  constructor(message?: string) {
    super(message);
  }
}
export class InternalServerError extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'INTERNAL_SERVER_ERROR';
    }
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export class BadRequest extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'BAD_REQUEST';
    }
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NotFound extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'NOT_FOUND';
    }
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class Conflict extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'CONFLICT';
    }
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export class Unauthorized extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'UNAUTHORIZED';
    }
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class Forbidden extends RequestError {
  constructor(errorData?: ErrorParams | string) {
    if (typeof errorData === 'string') {
      super(errorData);
    } else {
      super(errorData?.message);
      this.name = errorData?.name || 'FORBIDDEN';
    }
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
