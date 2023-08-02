import db from 'server/models';

import { BadRequestError } from 'server/utils/userFacingErrors';

const checkDuplicateUsername = async (req, res, next) => {
  try {
    await db.User.findByUsername(req.body.username).then((user) => {
      if (user) {
        throw new BadRequestError('Username is already in use', { errorCode: 'username' });
      }
    });

    return next();
  } catch (e) {
    return next(e);
  }
};

const checkRolesExist = (req, res, next) => {
  // Attaching roles to registration request is optional
  if (!req.body.roles || req.body.roles?.length < 1) return next();

  // Check attached roles
  for (let i = 0; i < req.body.roles.length; i++) {
    if (!roles.includes(req.body.roles[i])) {
      throw new BadRequestError(`Role ${req.body.roles[i]} does not exist!`, { errorCode: 'role' });
    }
  }

  return next();
};

const verifyRegistration = {
  checkDuplicateUsername,
  checkRolesExist
};

export default verifyRegistration;
