import db from 'server/models';
import { systemColors } from 'config/appConfig';
import { userColors } from 'config/appConfig';

const createSystemCalendar = (Calendar) => (name) => {
  const _obj = new Calendar({
    name: name,
    color: `#${systemColors[0]}`,
    user: null,
    systemCalendar: true
  });

  return _obj.save((err, calendar) => {
    if (err) {
      throw err;
    }
    console.log('added', calendar.name, 'to calendars collection');
  });
};

const createUserDefaultCalendar = (Calendar) => (userId, username) => {
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

const createUserCalendar = (Calendar) => (userId, calendarName) => {
  const calendars = Calendar.find({ user: userId }).exec();

  const _obj = new Calendar({
    name: calendarName,
    color: `#${userColors[calendars.length % userColors.length]}`,
    user: userId,
    userDefault: false,
    systemCalendar: false
  });

  return _obj.save();
};

const getCalendars = (Calendar) => (userId) => {
  return Calendar.find({
    $or: [{ user: userId }, { systemCalendar: true }]
  });
};

const updateCalendar = (Calendar) => (calendarId, calendarName) => {
  return Calendar.findOneAndUpdate({ _id: db.mongoose.Types.ObjectId(calendarId) }, { calendarName }, { new: true });
};

const deleteCalendar = (Calendar) => (calendarId) => {
  return Calendar.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(calendarId) });
};

const calendarService = (Calendar) => {
  return {
    createSystemCalendar: createSystemCalendar(Calendar),
    createUserDefaultCalendar: createUserDefaultCalendar(Calendar),
    createUserCalendar: createUserCalendar(Calendar),
    getCalendars: getCalendars(Calendar),
    updateCalendar: updateCalendar(Calendar),
    deleteCalendar: deleteCalendar(Calendar)
  };
};

export default calendarService;
