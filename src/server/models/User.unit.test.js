import jest from 'Jest';

import db from 'server/models';

const User = db.user;
// const mongoose = db.mongoose;

const mockRequest = (body) => ({
  body
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Registering user', () => {
  it('should not validate user if username is empty string', async () => {
    const invalidUser = { username: '', password: 'asdf' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrow();
  });

  it('should not validate user if username is less than 4 characters', async () => {
    const invalidUser = { username: 'joe', password: 'asdf' };
    const user = new User(invalidUser);
    await expect(user.validate()).rejects.toThrow();
  });
});
