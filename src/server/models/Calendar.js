import mongoose from 'mongoose';

import { DuplicateKeyError } from 'server/utils/databaseErrors';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userDefault: {
    type: Boolean,
    required: true,
    default: false
  },
  systemCalendar: {
    type: Boolean,
    required: true,
    default: false
  }
});

// schema middleware to apply after saving
const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    throw new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
      errorCode: 'calendarName'
    });
  } else {
    return next();
  }
};

schema.post('save', handleE11000);
schema.post('findOneAndUpdate', handleE11000);

// schema index
schema.index({ user: 1, name: 1 }, { unique: true });

const Calendar = mongoose.model('Calendar', schema);

export default Calendar;
