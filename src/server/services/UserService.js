import { NotFoundError } from 'server/utils/userFacingErrors';

const registerUser = (User) => (username, password) => {
  const _obj = new User({
    username: username,
    password: password
  });

  return _obj.save();
};

const validateLogin = (User) => (username, password) => {
  const user = User.findOne({ username: username }).populate('roles', '-__v').exec();

  if (!user) {
    return new NotFoundError('User not found', { errorCode: 'username' });
  }

  return User.validatePassword(password);
};

const UserService = (User) => {
  return {
    registerUser: registerUser(User),
    validateLogin: validateLogin(User)
  };
};

export default UserService;
