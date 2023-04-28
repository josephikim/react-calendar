import { systemColors, userColors } from 'config/appConfig';

class CalendarService {
  constructor(model) {
    this.model = model;
  }

  // Get user and system calendars
  getAll = async (userId) => {
    try {
      const result = await this.model.find({
        $or: [{ user: userId }, { systemCalendar: true }]
      });

      return result;
    } catch (e) {
      throw e;
    }
  };

  create = async (data) => {
    try {
      const isSystemCalendar = data.user === null;
      const calendarCount = await this.model.countDocuments(data.user);

      const _obj = {
        user: data.user,
        name: data.name,
        userDefault: isSystemCalendar ? false : calendarCount === 0 ? true : false,
        systemCalendar: isSystemCalendar ?? false,
        color: isSystemCalendar ? `#${systemColors[0]}` : `#${userColors[calendarCount % userColors.length]}`
      };

      const result = await this.model.create(_obj);

      return result;
    } catch (e) {
      throw e;
    }
  };

  update = async (id, name) => {
    try {
      const result = await this.model.findOneAndUpdate({ id }, { name }, { new: true });

      return result;
    } catch (e) {
      throw e;
    }
  };

  delete = async (id) => {
    try {
      const result = await this.model.findByIdAndDelete({ id });

      if (!result) {
        const error = new Error('Calendar not found');

        error.statusCode = 404;
        throw error;
      } else {
        return { deleted: true };
      }
    } catch (e) {
      throw e;
    }
  };
}

export default CalendarService;
