import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Enter a username.'],
    unique: [true, 'That username is taken.'],
    lowercase: true,
    validate: [validator.isAlphanumeric, 'Usernames may only have letters and numbers.']
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
userSchema.pre('save', async function (next) {

  //hash the password, set hash cost to 12  
  this.password = await bcrypt.hash(this.password, 12);

  //remove the passwordConfirmed field 
  this.passwordConfirm = undefined;
  next();
});

let User = mongoose.model('User', userSchema);

User.get = (query) => {
  return User.find(query);
}

User.addUser = (userToAdd) => {
  return userToAdd.save();
}

User.updateUser = (req) => {
  return User.findByIdAndUpdate(req.params.userid, req.body, { new: true });
}

User.removeUser = (userId) => {
  return User.remove({ id: userId });
}

export default User;