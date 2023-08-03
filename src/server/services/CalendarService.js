import HttpResponse from 'server/utils/httpResponse';
import { systemColors, userColors } from 'config/appConfig';

class CalendarService {
  constructor(model) {
    this.model = model;
  }

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

  getOne = async (calendarId) => {
    try {
      // Mongoose returns [] for .find query with no matches
      const result = await this.model.findOne({ id: calendarId });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  // Get user and system calendars
  getUserCalendars = async (userId) => {
    try {
      // Mongoose returns [] for .find query with no matches
      const result = await this.model.find({ user_id: { $in: [userId, 'system'] } });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  update = async (calendarId, data) => {
    try {
      // Mongoose returns the modified document (or null) for .findOneAndUpdate query with option 'new: true'
      const result = await this.model.findOneAndUpdate({ id: calendarId }, { $set: data }, { new: true });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  delete = async (calendarId) => {
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
