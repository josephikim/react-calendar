import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiryDate: Date
});

// refreshTokenSchema.statics.createToken = async function (userId) {
//   let expiredAt = new Date();

//   expiredAt.setSeconds(expiredAt.getSeconds() + JWT_REFRESH_EXPIRATION);

//   let _token = uuidv4();

//   let _obj = new this({
//     token: _token,
//     user: userId,
//     expiryDate: expiredAt.getTime()
//   });

//   let refreshToken = await _obj.save();

//   return refreshToken.token;
// };

// refreshTokenSchema.statics.refreshToken = async function (requestToken) {
//   let refreshToken = await this.findOne({ token: requestToken });

//   // Refresh token not found in database
//   if (!refreshToken) {
//     return;
//   }

//   // Refresh token expired
//   if (this.verifyExpiration(refreshToken)) {
//     this.findByIdAndRemove(refreshToken._id, {
//       useFindAndModify: false
//     }).exec();
//     return;
//   }

//   let newAccessToken = jwt.sign({ id: refreshToken.user._id }, JWT_SECRET_KEY, {
//     expiresIn: JWT_EXPIRATION
//   });

//   return {
//     accessToken: newAccessToken,
//     refreshToken: refreshToken.token
//   }
// };

refreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
