import db from 'server/models';
import { BadRequestError } from 'server/utils/userFacingErrors';

const User = db.User;
const ROLES = db.ROLES;

const checkDuplicateUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    });

    if (user) {
      throw new BadRequestError('Username is already in use', { errorCode: 'username' });
    }
  } catch (e) {
    return next(e);
  }
};

const checkRolesExist = (req, res, next) => {
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
  checkRolesExist
};

export default verifyRegistration;
