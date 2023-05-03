import jwt from 'jsonwebtoken';
import RefreshTokenService from './RefreshTokenService';
import RoleService from './RoleService';
import { AuthorizationError, NotFoundError } from 'server/utils/userFacingErrors';
import HttpResponse from '../utils/httpResponse';

class UserService {
  constructor(model, refreshTokenModel, roleModel) {
    this.model = model;
    this.refreshTokenService = new RefreshTokenService(refreshTokenModel);
    this.roleService = new RoleService(roleModel);
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

  update = async (userId, data) => {
    try {
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

  refreshToken = async (requestToken) => {
    try {
      const refreshToken = await this.refreshTokenService.get({ token: requestToken });

      if (!refreshToken) {
        // Refresh token not found
        throw new NotFoundError('Invalid request token', { errorCode: 'refreshToken' });
      }

      await this.refreshTokenService.verify(refreshToken);

      // create new JWT token
      const accessToken = jwt.sign({ id: refreshToken.user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: Number(process.env.JWT_EXPIRATION)
      });

      return {
        accessToken,
        refreshToken
      };
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
}

export default UserService;
