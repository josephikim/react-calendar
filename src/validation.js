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
      return 'Username should only contain letters and numbers';
    }
    if (!validator.isLength(username, { min: 4 })) {
      return 'Username should be at least four characters';
    }
    return false;
  }

  validatePassword(password) {
    if (!validator.isAlphanumeric(password)) {
      return 'Password should only contain letters and numbers';
    }
    if (!validator.isLength(password, { min: 4 })) {
      return 'Password should be at least four characters';
    }
    return false;
  }
  
  validatePasswordConfirm(candidatePassword, password) {
    if (candidatePassword !== password) {
      return 'Passwords don\'t match';
    }
    return false;
  }

  validateCalendarName(calendarName) {
    if (!validator.matches(calendarName, /^[\w\-\s]*$/)) {
      return 'Calendar name should include letters, numbers and spaces only';
    }
    if (!validator.isLength(calendarName, { min: 4 })) {
      return 'Calendar name should be at least four characters';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };