import validator from 'validator';

class ValidateFields {
  validateTitle(title) {
    if (validator.isEmpty(title)) {
      return 'Title is required';
    }
    return false;
  }
}

const validateFields = new ValidateFields();

export { validateFields };