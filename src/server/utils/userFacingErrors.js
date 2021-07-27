import { UserFacingError } from './baseErrors';

class BadRequestError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 400;
  }
}

class NotFoundError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
      this['accessToken'] = null;
    }
  }
  get statusCode() {
    return 404
  }
}

class AuthorizationError extends UserFacingError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 401;
  }
}

export {
  BadRequestError,
  NotFoundError,
  AuthorizationError
}