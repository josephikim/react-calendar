import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Calendar from './Calendar';
import { DuplicateKeyError } from 'server/utils/databaseErrors';
import { systemColors, userColors } from '../../config/appConfig';

const SALT_WORK_FACTOR = 10;

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Enter a username.'],
    minLength: [4, 'Username should be at least four characters'],
    unique: [true, 'That username is taken.']
  },
  password: {
    type: String,
    required: [true, 'Enter a password.'],
    minLength: [4, 'Password should be at least four characters']
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  ],
  calendarSettings: [
    {
      calendar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar'
      },
      userDefault: {
        type: Boolean,
        required: true,
        default: false
      },
      visibility: {
        type: Boolean,
        required: true,
        default: true
      },
      color: {
        type: String,
        required: true
      }
    }
  ]
});

// preserving isNew state for 'post' middleware
schema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

// schema middleware to apply before saving
schema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (e) {
    return next(e);
  }
});

// schema middleware to check for duplicate keys
const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    throw new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
      errorCode: 'username'
    });
  } else {
    return next();
  }
};

schema.post('save', handleE11000);

// Create user default cal and embed calendar settings
schema.post('save', async function () {
  if (this.id && this.wasNew) {
    try {
      // check for existing user default cal
      const calendars = await Calendar.find({
        user_id: this.id
      });

      if (calendars.length > 0) {
        throw new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
          errorCode: 'calendar'
        });
      }

      // Create user default cal
      const doc = new Calendar({
        name: this.username,
        user_id: this.id
      });

      const defaultCal = await doc.save();

      // Lookup system cals
      const systemCals = await Calendar.find({
        user_id: 'system'
      });

      const settings = [
        {
          calendar: defaultCal.id,
          userDefault: true,
          visibility: true,
          color: `#${userColors[0]}`
        }
      ];

      systemCals.forEach((cal, idx) => {
        settings.push({
          calendar: cal.id,
          userDefault: false,
          visibility: true,
          color: `#${systemColors[idx]}`
        });
      });

      // embed calendar settings in user doc
      settings.forEach((entry) => {
        this.calendarSettings.push(entry);
      });

      await this.save();
    } catch (e) {
      return next(e);
    }
  }
});

schema.statics.findByUsername = async function (username) {
  // Mongoose returns null for .findOne query with no matches
  return this.findOne({ username });
};

schema.methods.validatePassword = async function validatePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', schema);

export default User;
