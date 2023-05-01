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
  // Attaching roles to registration request is optional
  if (!req.body.roles) return next();

  // Check attached roles
  try {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        throw new BadRequestError(`Role ${req.body.roles[i]} does not exist!`, { errorCode: 'role' });
      }
    }
  } catch (e) {
    return next(e);
  }
};

const verifyRegistration = {
  checkDuplicateUsername,
  checkRolesExist
};

export default verifyRegistration;
