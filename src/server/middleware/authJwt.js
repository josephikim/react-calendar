import jwt from 'jsonwebtoken';
import { SECRET } from '../config/authConfig';
import db from '../models';

const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ msg: 'No token provided!' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ msg: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ msg: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }

        res.status(403).send({ msg: 'Require Admin Role!' });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ msg: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ msg: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }

        res.status(403).send({ msg: 'Require Moderator Role!' });
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