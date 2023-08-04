import mongoose from 'mongoose';
import User from './User';
import { systemColors } from 'config/appConfig';

import { DuplicateKeyError } from 'server/utils/databaseErrors';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    default: 'system'
  }
});

// preserving isNew state for 'post' middleware
schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

// schema middleware to apply after saving
const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    throw new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
      errorCode: 'calendar'
    });
  } else {
    return next();
  }
};

schema.post('save', handleE11000);
schema.post('findOneAndUpdate', handleE11000);

// Embed calendar settings in corresponding user doc(s)
schema.post('save', async function () {
  if (this.id && this.wasNew) {
    try {
      // on create system calendar
      if (this.user_id === 'system') {
        // count system cals
        const systemCalendarsCount = await Calendar.countDocuments({ user_id: 'system' });

        // prepare calendar settings object
        const settings = {
          calendar: this.id,
          userDefault: false,
          visibility: true,
          color: `#${systemColors[(systemCalendarsCount - 1) % systemColors.length]}`
        };

        // embed in all user docs
        await User.updateMany({}, { $push: { calendarSettings: settings } });
      }
    } catch (e) {
      throw new Error(e);
    }
  }
});

// schema index
schema.index({ name: 1, user_id: 1 }, { unique: true });

const Calendar = mongoose.model('Calendar', schema);

export default Calendar;
