import jwt from 'jsonwebtoken';
import db from 'server/models';

const User = db.User;
const Role = db.Role;
const { TokenExpiredError } = jwt;

const catchError = (e, res) => {
  if (e instanceof TokenExpiredError) {
    return res.status(401).send({ message: 'Unauthorized! Access Token was expired!', errorCode: 'accesstoken' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!', errorCode: 'accesstoken' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!', errorCode: 'accesstoken' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (e, decoded) => {
    if (e) {
      return catchError(e, res);
    }

    req.user = {
      id: decoded.id
    };

    return next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.id).exec((e, user) => {
    if (e) {
      return next(e);
    }

    // Mongoose returns [] for .find query with no matches
    Role.find(
      {
        id: { $in: user.roles }
      },
      (e, roles) => {
        if (e) {
          return next(e);
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            return next();
          }
        }

        return res.status(403).send({ message: 'Require Admin Role!', errorCode: 'role' });
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.id).exec((e, user) => {
    if (e) {
      return next(e);
    }

    // Mongoose returns [] for .find query with no matches
    Role.find(
      {
        id: { $in: user.roles }
      },
      (e, roles) => {
        if (e) {
          return next(e);
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            return next();
          }
        }

        return res.status(403).send({ message: 'Require Moderator Role!', errorCode: 'role' });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};

export default authJwt;
