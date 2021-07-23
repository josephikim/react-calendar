import jwt from 'jsonwebtoken';
import db from '../models';
import config from '../config/authConfig';

const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

const register = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  
  // If no errors, register user
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ msg: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ msg: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ msg: err });
              return;
            }

            res.send({
              user: user,
              msg: "User was registered successfully!"
            });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ msg: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ msg: err });
            return;
          }

          res.send({
            username: user.username,
            msg: "User was registered successfully!"
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
        res.status(500).send({ msg: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ msg: "User not found!" });
      }

      let passwordIsValid = req.body.redirect ? true : await user.validatePassword(req.body.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          msg: "Invalid password!"
        });
      }

      // If password is valid, create JWT token
      let token = jwt.sign({ id: user.id }, config.SECRET, {
        expiresIn: config.JWT_EXPIRATION
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken
      });
    });
};

const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ msg: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ msg: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        msg: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
};

const authController = {
  register,
  login,
  refreshToken
}
export default authController;