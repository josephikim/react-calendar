import UserService from 'server/services/UserService';
import db from 'server/models';
import { AuthorizationError } from '../utils/userFacingErrors';

const userService = new UserService(db.User, db.RefreshToken, db.Role, db.Calendar, db.Event);

class UserController {
  constructor(service) {
    this.service = service;
  }

  // create user, assign roles
  register = async (req, res, next) => {
    try {
      const user = await this.service.create(req.body);

      const roles = req.body?.roles ?? ['user'];

      const rolesAssigned = await this.service.assignRoles(user, roles);

      return next();
    } catch (e) {
      return next(e);
    }
  };

  // Look up user, validate pw, create refresh token
  login = async (req, res, next) => {
    try {
      const response = await this.service.login(req.body.username, req.body.password);

      await res.status(200).send(response);
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

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  getData = async (req, res, next) => {
    const userId = req.id;

    if (!userId) {
      throw new AuthorizationError('Access token corrupted. Please login again.', { errorCode: 'accessToken' });
    }

    try {
      // get user calendars and events
      const response = await this.service.getData(userId);

      await res.status(200).send(response);
    } catch (err) {
      return next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.id, req.body);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new UserController(userService);
