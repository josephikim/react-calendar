import jwt from 'jsonwebtoken';
import db from '../models';
import config from '../config/authConfig';
import { NotFoundError, AuthorizationError } from '../utils/userFacingErrors';

const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

const register = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  // If no errors, register user
  user.save((err, user) => {
    if (err) {
      return next(err);
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            return next(err);
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              return next(err);
            }

            next();
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          return next(err);
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            return next(err);
          }

          next();
        });
      });
    }
  });
};

const login = (req, res, next) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(
          new NotFoundError(
            'User not found',
            { errorCode: 'username' }
          )
        );
      }

      let passwordIsValid = await user.validatePassword(req.body.password);

      if (!passwordIsValid) {
        return next(
          new AuthorizationError(
            'Invalid password',
            { errorCode: 'password', accessToken: null }
          )
        );
      }

      // If password is valid, create JWT token
      let token = jwt.sign({ id: user.id }, config.SECRET, {
        expiresIn: config.JWT_EXPIRATION
      });

      let refreshToken = await RefreshToken.createToken(user);

      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
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

const refreshToken = async (req, res, next) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    // Refresh token is required
    return res.redirect('/login');
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      // Refresh token not found in database
      return res.redirect('/login');
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      return res.redirect('/login');
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.SECRET, {
      expiresIn: config.JWT_EXPIRATION,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return next(err);
  }
};

const authController = {
  register,
  login,
  refreshToken
}
export default authController;