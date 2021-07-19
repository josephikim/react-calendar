import jwt from 'jsonwebtoken';
import db from '../models';
import { SECRET } from '../config/authConfig';

const User = db.user;
const Role = db.role;

const register = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  
  // If no errors, register user
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ error: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ error: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ error: err });
              return;
            }

            res.send({
              user: user,
              message: "User was registered successfully!"
            });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ error: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ error: err });
            return;
          }

          res.send({
            username: user.username,
            message: "User was registered successfully!"
          });
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
        res.status(500).send({ error: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ error: { username: "User not found!" } });
      }

      const passwordIsValid = req.body.redirect ? true : await user.validatePassword(req.body.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          error: { password: "Invalid password!" }
        });
      }

      // If password is valid, create JWT token
      const token = jwt.sign({ id: user.id }, SECRET, {
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