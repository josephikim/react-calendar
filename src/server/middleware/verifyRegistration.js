import db from '../models';

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ error: { username: err } });
      return;
    }

    if (user) {
      res.status(400).send({ error: { username: 'Username is already in use!' } });
      return;
    }

    next();
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          msg: `Role ${req.body.roles[i]} does not exist!`
        });
        return;
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