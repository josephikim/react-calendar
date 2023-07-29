import mongoose from 'mongoose';
import UserService from './UserService';
import HttpResponse from 'server/utils/httpResponse';
import { systemColors, userColors } from 'config/appConfig';

class CalendarService {
  constructor(model, userModel) {
    this.model = model;
    this.userService = new UserService(userModel);
  }

  // Get user and system calendars
  getAll = async (userId) => {
    try {
      // Mongoose returns [] for .find query with no matches
      const result = await this.model.find({ user_id: { $in: [userId, 'system'] } });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  create = async (data) => {
    try {
      const user = data.user;
      const userCalendarsCount = await this.model.countDocuments({ user });
      const systemCalendarsCount = await this.model.countDocuments({ user_id: 'system' });

      const _obj = {
        user,
        name: data.name,
        userDefault: !user ? false : userCalendarsCount === 0 ? true : false,
        systemCalendar: data.user_id === 'system',
        color:
          data.user_id === 'system'
            ? `#${systemColors[systemCalendarsCount & systemColors.length]}`
            : `#${userColors[userCalendarsCount % userColors.length]}`,
        visibility: data.visibility || true
      };

      const result = await this.model.create(_obj);

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  update = async (userId, calendarId, data) => {
    try {
      // If data includes 'name', update calendar model and user.calendarsettings.
      // Otherwise update user.calendarSettings

      const result = {};

      // Update calendar doc
      if (Object.keys(data).includes('name')) {
        // Mongoose returns the modified document (or null) for .findOneAndUpdate query with option 'new: true'
        const calendarDoc = await this.model.findOneAndUpdate(
          { id: calendarId, user_id: 'grouch' },
          { $set: data },
          { new: true }
        );

        if (!calendarDoc) {
          throw new NotFoundError('No matching calendar(s) found', { errorCode: 'calendar' });
        }
        result = {
          ...calendarDoc
        };
      }

      // Update user doc's calendar settings
      const key = Object.keys(data)[0];

      if (['userDefault', 'visibility', 'color'].includes(key)) {
        const userDoc = await this.userService.updateOne(
          { id: userId, 'calendarSettings.calendar': calendarId },
          { $set: { key: data[key] } }
        );

        result = {
          ...userDoc.calendarSettings
        };
      }

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  delete = async (id) => {
    try {
      // Mongoose returns the matching document (or null) for .findByIdAndDelete query
      const result = await this.model.findByIdAndDelete(id);

      if (!result) {
        const error = new Error('Calendar not found');

        error.statusCode = 404;
        throw error;
      } else {
        return new HttpResponse(result, { deleted: true });
      }
    } catch (e) {
      throw e;
    }
  };
}

export default CalendarService;
