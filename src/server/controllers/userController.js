import UserService from 'server/services/userService';
import db from 'server/models';

const userService = new UserService(db.User, db.RefreshToken, db.Role);

class UserController {
  constructor(service) {
    this.service = service;
  }

  // create user, assign roles
  register = async (req, res, next) => {
    try {
      const user = await this.service.create(req.body);

      const roles = req.body?.roles ?? ['user'];

      await this.service.assignRoles(user, roles).then(next());
    } catch (e) {
      return next(e);
    }
  };

  // Look up user, validate pw, create refresh token
  login = async (req, res, next) => {
    try {
      const response = await this.service.login(req.body.username, req.body.password);

      await res.status(response.statusCode).json(response);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.body.id, req.body.data);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };

  refreshToken = async (req, res, next) => {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
      // Request token is missing
      return res.redirect('/login');
    }

    try {
      const response = await this.service.refreshToken(requestToken);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };
}

export default new UserController(userService);
