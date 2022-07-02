import db from '../models';
import { AuthorizationError } from '../utils/userFacingErrors';
import { userColors } from '../../config/appConfig';

const Event = db.event;
const User = db.user;
const Calendar = db.calendar;

const allAccess = (req, res) => {
  res.status(200).send('Public content');
};

const userAccess = (req, res) => {
  res.status(200).send('User content');
};

const adminAccess = (req, res) => {
  res.status(200).send('Admin content');
};

const moderatorAccess = (req, res) => {
  res.status(200).send('Moderator content');
};

const getUserData = async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(500).send({ message: 'GET request failed. Please check your query and try again.' });
  }

  try {
    let user = await User.findOne({ _id: userId });

    let calendars = await Calendar.find({
      $or: [{ user: userId }, { systemCalendar: true }]
    });

    const calendarIds = calendars.map((calendar) => calendar._id);

    let events = await Event.find({
      calendarId: {
        $in: calendarIds
      }
    })
      .select('-__v')
      .sort({ start: -1 });

    // Prepare response data
    const trimmedCalendars = calendars.map((calendar) => {
      return {
        id: calendar._id,
        name: calendar.name,
        color: calendar.color,
        user: calendar.user,
        userDefault: calendar.userDefault,
        systemCalendar: calendar.systemCalendar,
        visibility: true
      };
    });

    const trimmedEvents = events.map((event) => {
      return {
        id: event._id,
        title: event.title,
        desc: event.desc,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        calendarId: event.calendarId
      };
    });

    const userData = {
      username: user.username,
      calendars: trimmedCalendars,
      calendarEvents: trimmedEvents
    };

    return res.status(200).send(userData);
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = new Event(req.body);

    let createdEvent = await event.save();

    const trimmedEvent = {
      id: createdEvent._id,
      title: createdEvent.title,
      desc: createdEvent.desc,
      start: createdEvent.start,
      end: createdEvent.end,
      allDay: createdEvent.allDay,
      calendarId: createdEvent.calendarId
    };

    return res.status(200).send(trimmedEvent);
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.id;

  try {
    let deletedEvent = await Event.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(eventId) });

    const trimmedEvent = {
      id: deletedEvent._id
    };

    return res.status(200).send(trimmedEvent);
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  let payload = req.body;
  payload.id = db.mongoose.Types.ObjectId(payload.id);
  payload.calendarId = db.mongoose.Types.ObjectId(payload.calendarId);
  payload.start = new Date(payload.start);
  payload.end = new Date(payload.end);

  try {
    let updatedEvent = await Event.findOneAndUpdate({ _id: payload.id }, payload, { new: true });

    const trimmedEvent = {
      id: updatedEvent._id,
      title: updatedEvent.title,
      desc: updatedEvent.desc,
      start: updatedEvent.start,
      end: updatedEvent.end,
      allDay: updatedEvent.allDay,
      calendarId: updatedEvent.calendarId
    };

    return res.status(200).send(trimmedEvent);
  } catch (err) {
    return next(err);
  }
};

const updateUsername = async (req, res, next) => {
  let payload = req.body;
  payload.userId = db.mongoose.Types.ObjectId(payload.userId);

  try {
    User.findOne({
      _id: payload.userId
    }).exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      user.username = payload.username;

      user.save((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).send({
          id: user._id,
          username: user.username,
          message: 'Username updated successfully!'
        });
      });
    });
  } catch (err) {
    return next(err);
  }
};

const updatePassword = async (req, res, next) => {
  let payload = req.body;
  payload.userId = db.mongoose.Types.ObjectId(payload.userId);

  try {
    User.findOne({
      _id: payload.userId
    }).exec(async (err, user) => {
      if (err) {
        return next(err);
      }

      let passwordIsValid = await user.validatePassword(payload.password);

      if (!passwordIsValid) {
        return next(new AuthorizationError('Invalid password', { errorCode: 'password' }));
      }

      // If password is valid, update with new password
      user.password = payload.newPassword;

      user.save((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).send({
          message: 'Password updated successfully!'
        });
      });
    });
  } catch (err) {
    return next(err);
  }
};

const createCalendar = async (req, res, next) => {
  const userId = req.body.userId;
  const name = req.body.name;

  try {
    let userCalendars = await Calendar.find({ user: userId });

    let data = {
      name: name,
      color: `#${userColors[userCalendars.length % userColors.length]}`,
      user: userId,
      userDefault: false,
      systemCalendar: false
    };

    const calendar = new Calendar(data);

    let createdCalendar = await calendar.save();

    const trimmedCalendar = {
      id: createdCalendar._id,
      name: createdCalendar.name,
      color: createdCalendar.color,
      user: createdCalendar.user,
      userDefault: createdCalendar.userDefault,
      systemCalendar: createdCalendar.systemCalendar,
      visibility: true
    };

    return res.status(200).send(trimmedCalendar);
  } catch (err) {
    return next(err);
  }
};

const updateCalendar = async (req, res, next) => {
  let payload = req.body;
  payload.calendarId = db.mongoose.Types.ObjectId(payload.calendarId);

  try {
    let updatedCalendar = await Calendar.findOneAndUpdate({ _id: payload.calendarId }, payload, { new: true });

    const trimmedCalendar = {
      id: updatedCalendar._id,
      name: updatedCalendar.name,
      color: updatedCalendar.color,
      user: updatedCalendar.user,
      userDefault: updatedCalendar.userDefault,
      systemCalendar: updatedCalendar.systemCalendar
    };

    return res.status(200).send(trimmedCalendar);
  } catch (err) {
    return next(err);
  }
};

const deleteCalendar = async (req, res, next) => {
  const calendarId = req.params.id;

  try {
    let deletedCalendar = await Calendar.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(calendarId) });

    const trimmedCalendar = {
      id: deletedCalendar._id
    };

    return res.status(200).send(trimmedCalendar);
  } catch (err) {
    return next(err);
  }
};

const userController = {
  allAccess,
  userAccess,
  adminAccess,
  moderatorAccess,
  getUserData,
  createEvent,
  deleteEvent,
  updateEvent,
  updateUsername,
  updatePassword,
  createCalendar,
  updateCalendar,
  deleteCalendar
};

export default userController;
