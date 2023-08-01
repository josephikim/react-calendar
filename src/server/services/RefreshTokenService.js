import { v4 as uuidv4 } from 'uuid';
import { AuthorizationError } from 'server/utils/userFacingErrors';

class RefreshTokenService {
  constructor(model) {
    this.model = model;
  }

  get = async (requestToken) => {
    try {
      // Mongoose returns null for .findOne query with no matches
      const result = await this.model.findOne({ token: requestToken });

      return result;
    } catch (e) {
      throw e;
    }
  };

  create = async (userId) => {
    try {
      const expiredAt = new Date();

      expiredAt.setSeconds(expiredAt.getSeconds() + Number(process.env.JWT_REFRESH_EXPIRATION));

      const _token = uuidv4();

      const data = {
        token: _token,
        user: userId,
        expiryDate: expiredAt.toISOString()
      };

      const result = await this.model.create(data);

      return result;
    } catch (e) {
      throw e;
    }
  };

  verify = async (token) => {
    try {
      if (this.model.verifyExpiration(token)) {
        // Refresh token expired
        // Mongoose returns the matching document (or null) for .findByIdAndRemove query
        await this.model.findByIdAndRemove(token.id, {
          useFindAndModify: false
        });

        throw new AuthorizationError('Refresh token expired', { errorCode: 'refreshToken' });
      } else {
        return true;
      }
    } catch (e) {
      throw e;
    }
  };
}

export default RefreshTokenService;
