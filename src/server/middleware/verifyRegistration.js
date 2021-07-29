import db from '../models';
import { BadRequestError } from '../utils/userFacingErrors';

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      return next(
        new BadRequestError(
          'Username is already in use',
          { errorCode: 'username' }
        )
      );
    }

    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return next(
          new BadRequestError(
            `Role ${req.body.roles[i]} does not exist!`,
            { errorCode: 'roles' }
          )
        );
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