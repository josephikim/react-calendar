import jwt from 'jsonwebtoken';
import authConfig from '../config/authConfig';
import db from '../models';
import { validateFields } from '../../validation.js';

const User = db.user;
const Role = db.role;

const register = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  // Pre schema validation
  const usernameError = validateFields.validateUsername(user.username);
  const passwordError = validateFields.validatePassword(user.password);
  const passwordConfirmError = validateFields.validatePasswordConfirm(user.passwordConfirm, user.password);

  let preSchemaErrors = {
    username: usernameError,
    password: passwordError,
    passwordConfirm: passwordConfirmError
  };

  for (const err in preSchemaErrors) {
    if (!preSchemaErrors[err]) {
      delete preSchemaErrors[err]
    }
  }

  if (Object.keys(preSchemaErrors).length > 0) {
    res.status(500).send({ errors: preSchemaErrors });
    return;
  }
  
  // If no errors, register user
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

const login = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ error: { username: "User Not found." } });
      }

      const passwordIsValid = await user.validatePassword(req.body.password) 

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          error: { password: "Invalid Password!" }
        });
      }

      const token = jwt.sign({ id: user.id }, authConfig.secret, {
        expiresIn: 86400 // 24 hours
      });

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
        accessToken: token
      });
    });
};

const authController = {
  register,
  login
}
export default authController;