import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, 'Enter a name.']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Enter a user id.']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Enter expiration date.']
  }
});

schema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const RefreshToken = mongoose.model('RefreshToken', schema);

export default RefreshToken;
