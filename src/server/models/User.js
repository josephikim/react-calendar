import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Calendar from './Calendar';
import { userColors } from '../config/appConfig';
import { DuplicateKeyError } from '../utils/databaseErrors';

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Enter a username.'],
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
    ]
  },
  { emitIndexErrors: true }
);

// preserving isNew state for 'post' middleware
userSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

// schema middleware to apply before saving
userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

// schema middleware to apply after saving
const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(
      new DuplicateKeyError('There was a conflict with an existing entry. Please try again.', {
        errorCode: 'username'
      })
    );
  } else {
    next();
  }
};

userSchema.post('save', handleE11000);
userSchema.post('findOneAndUpdate', handleE11000);

// Middleware to create user calendar on user creation
userSchema.post('save', async function () {
  if (this._id && this.wasNew) {
    Calendar.find(
      {
        user: this._id,
        userDefault: true
      },
      (err, calendar) => {
        if (err) {
          return err;
        }

        if (calendar.length > 0) {
          return;
        }

        // Create default user calendar
        return new Calendar({
          name: this.username,
          color: `#${userColors[0]}`,
          user: this._id,
          userDefault: true,
          systemCalendar: false
        }).save((err) => {
          if (err) {
            return err;
          }

          console.log('added new user calendar to calendars collection');
        });
      }
    );
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

let User = mongoose.model('User', userSchema);

export default User;
