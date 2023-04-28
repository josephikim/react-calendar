import db from 'server/models';
import { BadRequestError } from 'server/utils/userFacingErrors';

const User = db.User;
const ROLES = db.ROLES;

const checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((e, user) => {
    if (e) {
      return next(e);
    }

    if (user) {
      return next(new BadRequestError('Username is already in use', { errorCode: 'username' }));
    }

    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return next(new BadRequestError(`Role ${req.body.roles[i]} does not exist!`, { errorCode: 'roles' }));
      }
    }
  }

  next();
};

const verifyRegistration = {
  checkDuplicateUsername,
  checkRolesExisted
};

export default verifyRegistration;
