import mongoose, { ValidationError } from 'mongoose';
import db from 'server/models';

const User = db.user;

describe('Validating user', () => {
  it('Should return an error if username property is missing', async () => {
    const invalidUser = { password: 'password' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if username is empty string', async () => {
    const invalidUser = { username: '', password: 'password' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if username is less than 4 characters', async () => {
    const invalidUser = { username: 'joe', password: 'password' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should not return an error if username is more than 4 characters', async () => {
    const invalidUser = { username: 'joey', password: 'password' };
    const user = new User(invalidUser);
    await expect(user.validate()).resolves.not.toThrowError(ValidationError);
  });

  it('Should return an error if password property is missing', async () => {
    const invalidUser = { username: 'joey' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if password is empty string', async () => {
    const invalidUser = { username: 'joey', password: '' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if password is less than 4 characters', async () => {
    const invalidUser = { username: 'joey', password: 'pas' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should not return an error if password is more than 4 characters', async () => {
    const invalidUser = { username: 'joey', password: 'password' };
    const user = new User(invalidUser);
    await expect(user.validate()).resolves.not.toThrowError(ValidationError);
  });

  it('Should return an error if roles is not an array', async () => {
    const invalidUser = { username: 'joey', password: 'password', roles: {} };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if roles is an array of type string', async () => {
    const invalidUser = { username: 'joey', password: 'password', roles: ['role1', 'role2'] };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should not return an error if roles is an array of type Mongoose ObjectId', async () => {
    const invalidUser = { username: 'joey', password: 'password', roles: [new mongoose.Types.ObjectId()] };
    const user = new User(invalidUser);
    await expect(user.validate()).resolves.not.toThrowError(ValidationError);
  });
});
