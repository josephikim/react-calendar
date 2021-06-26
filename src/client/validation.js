import validator from 'validator';

class ValidateFields {
  validateTitle(title) {
    if (validator.isEmpty(title)) {
      return 'Title is required';
    }
    return false;
  }
  validateUsername(username) {
    if (!validator.isAlphanumeric(username)) {
      return 'Usernames may only contain letters and numbers';
    }
    return false;
  }
  validatePassword(password) {
    if (validator.isEmpty(password)) {
      return 'Password is required';
    }
    if (!validator.isLength(password, { min: 4 })) {
      return 'Password should be at least four characters';
    }
    return false;
  }
  validatePasswordConfirm(passwordConfirm, password) {
    if (passwordConfirm !== password) {
      return 'Passwords don\'t match';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };