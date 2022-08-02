import db from 'server/models';
import { systemColors } from 'config/appConfig';
import { userColors } from 'config/appConfig';

const initCalendars = (Calendar) => () => {
  Calendar.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      const _obj = new Calendar({
        name: 'US Holidays',
        color: `#${systemColors[0]}`,
        user: null,
        systemCalendar: true
      });

      _obj.save().exec(function (err, calendar) {
        if (err) {
          throw err;
        }
        return console.log('added', calendar.name, 'to calendars collection');
      });
    }
  });
};

const createDefaultCalendar = (Calendar) => (userId, username) => {
  const userCalendar = Calendar.find({ user: userId, userDefault: true }).exec();

  if (userCalendar.length > 0) {
    return;
  }

  // Create initial user calendar
  const _obj = new Calendar({
    name: username,
    color: `#${userColors[0]}`,
    user: userId,
    userDefault: true,
    systemCalendar: false
  });

  return _obj.save();
};

const getCalendars = (Calendar) => (userId) => {
  return Calendar.find({
    $or: [{ user: userId }, { systemCalendar: true }]
  });
};

const createCalendar = (Calendar) => (userId, calendarName) => {
  const calendars = Calendar.find({ user: userId }).exec();

  const newCalendar = new Calendar({
    name: calendarName,
    color: `#${userColors[calendars.length % userColors.length]}`,
    user: userId,
    userDefault: false,
    systemCalendar: false
  });

  return newCalendar.save();
};

const updateCalendar = (Calendar) => (calendarId, calendarName) => {
  return Calendar.findOneAndUpdate({ _id: db.mongoose.Types.ObjectId(calendarId) }, { calendarName }, { new: true });
};

const deleteCalendar = (Calendar) => (calendarId) => {
  return Calendar.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(calendarId) });
};

const CalendarService = (Calendar) => {
  return {
    initCalendars: initCalendars(Calendar),
    createDefaultCalendar: createDefaultCalendar(Calendar),
    getCalendars: getCalendars(Calendar),
    createCalendar: createCalendar(Calendar),
    updateCalendar: updateCalendar(Calendar),
    deleteCalendar: deleteCalendar(Calendar)
  };
};

export default CalendarService;
