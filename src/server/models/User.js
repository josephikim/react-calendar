import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Enter a username.'],
    unique: [true, 'That username is taken.'],
    lowercase: true,
    validate: [validator.isAlphanumeric, 'Usernames may only have letters and numbers.']
  },
  email: {
    type: String,
    require: [true, 'Enter an email address.'],
    unique: [true, 'That email address is taken.'],
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Enter a password.'],
    minLength: [4, 'Password should be at least four characters']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Retype your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      }, message: 'Passwords don\'t match.'
    }
  }
}, {collection : 'User'});

//schema middleware to apply before saving 
UserSchema.pre('save', async function (next) {

  //hash the password, set hash cost to 12  
  this.password = await bcrypt.hash(this.password, 12);

  //remove the passwordConfirmed field 
  this.passwordConfirm = undefined;
  next();
});

let UsersModel = mongoose.model('User', UserSchema);

UsersModel.get = (query) => {
  return UsersModel.find(query);
}

UsersModel.addUser = (userToAdd) => {
  return userToAdd.save();
}

UsersModel.updateUser = (req) => {
  return UsersModel.findByIdAndUpdate(req.params.userid, req.body, { new: true });
}

UsersModel.removeUser = (userId) => {
  return UsersModel.remove({ id: userId });
}

export default UsersModel;