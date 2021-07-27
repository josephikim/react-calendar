'use strict';

class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = message;
  } 
}

class DatabaseError extends ApplicationError {
  constructor(message) {
    super(message);
    this.name = message;
  } 
}

class UserFacingError extends ApplicationError {
  constructor(message) {
    super(message);
    this.name = message;
  } 
}

export {
  ApplicationError,
  DatabaseError,
  UserFacingError
}