import { ValidationError } from 'mongoose';
import db from 'server/models';

const Role = db.Role;

describe('Validating role', () => {
  it('Should return an error if name property is missing', async () => {
    const invalidRole = {};
    const role = new Role(invalidRole);
    await expect(role.validate()).rejects.toThrowError(ValidationError);
  });

  it('Should return an error if name is empty string', async () => {
    const invalidRole = { role: '' };
    const role = new Role(invalidRole);
    await expect(role.validate()).rejects.toThrowError(ValidationError);
  });
});
