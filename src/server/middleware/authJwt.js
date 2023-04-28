import jwt from 'jsonwebtoken';
import db from 'server/models';

const User = db.User;
const Role = db.Role;
const { TokenExpiredError } = jwt;

const catchError = (e, res) => {
  if (e instanceof TokenExpiredError) {
    return res.status(401).send({ message: 'Unauthorized! Access Token was expired!' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (e, decoded) => {
    if (e) {
      return catchError(e, res);
    }
    req.id = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.id).exec((e, user) => {
    if (e) {
      return next(e);
    }

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
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.id).exec((e, user) => {
    if (e) {
      return next(e);
    }

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
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Moderator Role!' });
        return;
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
