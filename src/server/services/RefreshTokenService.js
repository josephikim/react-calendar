import { v4 as uuidv4 } from 'uuid';
import { AuthorizationError } from 'server/utils/userFacingErrors';

class RefreshTokenService {
  constructor(model) {
    this.model = model;
  }

  create = async (userId) => {
    try {
      const expiredAt = new Date();

      expiredAt.setSeconds(expiredAt.getSeconds() + process.env.JWT_REFRESH_EXPIRATION);

      const _token = uuidv4();

      const _obj = {
        token: _token,
        user: userId,
        // expiryDate: expiredAt.getTime()
        expiryDate: expiredAt
      };

      const result = await this.model.create(_obj);
      return result;
    } catch (e) {
      throw e;
    }
  };

  get = async (requestToken) => {
    try {
      const result = await this.model.findOne({ token: requestToken });

      return result;
    } catch (e) {
      throw e;
    }
  };

  verify = async (token) => {
    try {
      if (this.model.verifyExpiration(token)) {
        // Refresh token expired
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
