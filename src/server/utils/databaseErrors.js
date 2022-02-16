import { DatabaseError } from './baseErrors';

class DuplicateKeyError extends DatabaseError {
  constructor(message, options = {}) {
    super(message);

    for (const [key, value] of Object.entries(options)) {
      this[key] = value;
    }
  }

  get statusCode() {
    return 409;
  }

  get mongoErrorCode() {
    return 11000;
  }
}

export { DuplicateKeyError };
