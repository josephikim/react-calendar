import mongoose from 'mongoose';
import HttpResponse from 'server/utils/httpResponse';
import { systemColors, userColors } from 'config/appConfig';

class CalendarService {
  constructor(model) {
    this.model = model;
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
      const systemCalendarsCount = await this.model.countDocuments({ systemCalendar: true });

      const _obj = {
        user,
        name: data.name,
        userDefault: !user ? false : userCalendarsCount === 0 ? true : false,
        systemCalendar: data.systemCalendar || false,
        color:
          data.systemCalendar === true
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

  update = async (id, data) => {
    try {
      // Mongoose returns the modified document (or null) for .findOneAndUpdate query with option 'new: true'
      const result = await this.model.findOneAndUpdate({ id }, { $set: data }, { new: true });

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
