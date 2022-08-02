import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

const createToken = (RefreshToken) => (userId) => {
  let expiredAt = new Date();

  expiredAt.setSeconds(expiredAt.getSeconds() + JWT_REFRESH_EXPIRATION);

  let _token = uuidv4();

  let _obj = new RefreshToken({
    token: _token,
    user: userId,
    expiryDate: expiredAt.getTime()
  });

  return _obj.save();
};

const refreshToken = (RefreshToken) => (requestToken) => {
  const refreshToken = RefreshToken.findOne({ token: requestToken }).exec();

  // Refresh token not found in database
  if (!refreshToken) {
    return;
  }

  // Refresh token expired
  if (RefreshToken.verifyExpiration(refreshToken)) {
    RefreshToken.findByIdAndRemove(refreshToken._id, {
      useFindAndModify: false
    }).exec();
    return;
  }

  const newAccessToken = jwt.sign({ id: refreshToken.user._id }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRATION
  });

  return {
    accessToken: newAccessToken,
    refreshToken: refreshToken
  };
};

const RefreshTokenService = (RefreshToken) => {
  return {
    createToken: createToken(RefreshToken),
    refreshToken: refreshToken(RefreshToken)
  };
};

export default RefreshTokenService;
