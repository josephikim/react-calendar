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
    const user = await this.model.findByUsername(username);

    if (!user) {
      // User not found
      throw new NotFoundError('Invalid username', { errorCode: 'username' });
    } else {
      // Process Login
      try {
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

        let response = {
          username,
          accessToken
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
      const accessToken = jwt.sign({ id: refreshToken.user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: Number(process.env.JWT_EXPIRATION)
      });

      const response = {
        accessToken,
        refreshToken
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
      // Get ids of system and user calendars
      const calendars = await this.calendarService.getAll(userId);

      if (!calendars.data || calendars.data.length < 1) {
        throw new NotFoundError('No matching calendar(s) found', { errorCode: 'calendar' });
      }

      const calendarIdArray = calendars.data.map((calendar) => {
        return calendar.id;
      });

      const events = await this.eventService.getAll(calendarIdArray);

      const response = {
        calendars: calendars.data,
        events: events.data
      };

      return new HttpResponse(response);
    } catch (e) {
      throw e;
    }
  };

  update = async (userId, data) => {
    try {
      // Mongoose returns the modified document (or null) for .findByIdAndUpdate query with option 'new: true'
      const result = await this.model.findByIdAndUpdate(
        {
          id: userId
        },
        data,
        { new: true }
      );

      return result;
    } catch (e) {
      throw e;
    }
  };
}

export default UserService;
