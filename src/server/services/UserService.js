import jwt from 'jsonwebtoken';
import RefreshTokenService from './RefreshTokenService';
import RoleService from './RoleService';
import CalendarService from './CalendarService';
import EventService from './EventService';
import { AuthorizationError, NotFoundError } from 'server/utils/userFacingErrors';
import HttpResponse from 'server/utils/httpResponse';

class UserService {
  constructor(model, refreshTokenModel, roleModel, calendarModel, eventModel) {
    this.model = model;
    this.refreshTokenService = new RefreshTokenService(refreshTokenModel);
    this.roleService = new RoleService(roleModel);
    this.calendarService = new CalendarService(calendarModel);
    this.eventService = new EventService(eventModel);
  }

  create = async (data) => {
    try {
      const result = await this.model.create(data);

      return result;
    } catch (e) {
      throw e;
    }
  };

  login = async (username, password) => {
    const user = await this.model.findOne({ username });

    if (!user) {
      // User not found
      throw new NotFoundError('Invalid username', { errorCode: 'username' });
    } else {
      // Process Login
      try {
        await user.populate('roles').execPopulate();

        const validated = await user.validatePassword(password);

        if (!validated) {
          throw new AuthorizationError('Invalid password', {
            errorCode: 'password',
            accessToken: null
          });
        }

        // If password is valid, create JWT token
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: Number(process.env.JWT_EXPIRATION)
        });

        // Add roles array to response
        const roleNames = user.roles.map((role) => role.name);

        const response = {
          username,
          accessToken,
          roles: roleNames
        };

        await this.refreshTokenService.create(user.id).then((refreshToken) => {
          response.refreshToken = refreshToken.token;
        });

        return new HttpResponse(response);
      } catch (e) {
        throw e;
      }
    }
  };

  refreshToken = async (requestToken) => {
    try {
      const refreshToken = await this.refreshTokenService.get(requestToken);

      // Mongoose returns null for Model.findOne query with no matches
      if (!refreshToken) {
        // Refresh token not found
        throw new NotFoundError('Invalid request token', { errorCode: 'refreshToken' });
      }

      await this.refreshTokenService.verify(refreshToken);

      // create new JWT token
      const accessToken = jwt.sign({ id: refreshToken.user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: Number(process.env.JWT_EXPIRATION)
      });

      const response = {
        accessToken
      };
      return new HttpResponse(response);
    } catch (e) {
      throw e;
    }
  };

  assignRoles = async (user, rolesArr) => {
    try {
      const roles = await this.roleService.get(rolesArr);

      if (!roles) {
        throw new NotFoundError('Role(s) not found', { errorCode: 'role' });
      }

      user.roles = roles.map((role) => role.id);

      const result = await user.save();

      return result;
    } catch (e) {
      throw e;
    }
  };

  getData = async (userId) => {
    try {
      // Get system and user calendars
      const calendars = await this.calendarService.getAll(userId);

      if (!calendars.data || calendars.data.length < 1) {
        throw new NotFoundError('No matching calendar(s) found', { errorCode: 'calendar' });
      }

      // Extract calendar ids
      const calendarIdArray = calendars.data.map((calendar) => {
        return calendar.id;
      });

      // Get system and user events
      const events = await this.eventService.getAll(calendarIdArray);

      const response = {
        calendars: calendars.data,
        events: events.data
      };

      return response;
    } catch (e) {
      throw e;
    }
  };

  update = async (userId, data) => {
    try {
      // Use find doc, modify doc, save doc pattern - hooks into 'save' pre middleware
      // Mongoose returns the modified document (or null) for .findById query
      const user = await this.model.findById(userId);

      if (!user) {
        throw new NotFoundError('No matching user found');
      }

      // update password
      if (data.password) {
        const validated = await user.validatePassword(data.password);
        if (!validated) {
          throw new AuthorizationError('Invalid password. Please try again.', { errorCode: 'password' });
        }

        user.password = data.newPassword || '';
      }

      // update username
      if (data.username) {
        user.username = data.username;
      }

      const result = await user.save();

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };
}

export default UserService;
