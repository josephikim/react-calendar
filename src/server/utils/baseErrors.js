class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class DatabaseError extends ApplicationError {}

class UserFacingError extends ApplicationError {}

export { ApplicationError, DatabaseError, UserFacingError };
