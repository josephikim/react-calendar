import mongoose, { ValidationError } from 'mongoose';
import db from 'server/models';

const RefreshToken = db.RefreshToken;

describe('Validating refresh token', () => {
  it('Should return an error if token property is missing', async () => {
    const invalidRefreshToken = { user: new mongoose.Types.ObjectId(), expiryDate: new Date() };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if token is empty string', async () => {
    const invalidRefreshToken = { token: '', user: new mongoose.Types.ObjectId(), expiryDate: new Date() };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if user property is missing', async () => {
    const invalidRefreshToken = { token: 'mytoken', expiryDate: new Date() };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if user property is type string', async () => {
    const invalidRefreshToken = { token: 'mytoken', user: 'joey', expiryDate: new Date() };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if expiryDate property is missing', async () => {
    const invalidRefreshToken = { token: 'mytoken', user: 'joey' };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if expiryDate property is type string', async () => {
    const invalidRefreshToken = { token: 'mytoken', user: 'joey', expiryDate: 'stringDate' };
    const refreshToken = new RefreshToken(invalidRefreshToken);
    await expect(refreshToken.validate()).rejects.toThrowError(ValidationError);
  });
});
