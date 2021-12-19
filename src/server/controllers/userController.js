import db from '../models';
import { AuthorizationError } from '../utils/userFacingErrors';
import { CALENDAR_COLORS } from '../config/appConfigs';

const Event = db.event;
const User = db.user;
const Calendar = db.calendar;

const allAccess = (req, res) => {
  res.status(200).send("Public content")
};

const userAccess = (req, res) => {
  res.status(200).send("User content")
};

const adminAccess = (req, res) => {
  res.status(200).send("Admin content")
};

const moderatorAccess = (req, res) => {
  res.status(200).send("Moderator content")
};

const retrieveEvents = async (req, res, next) => {
  const id = req.query.id;

  if (!id) {
    return res.status(500).send({ message: 'GET request failed. Please check your query and try again.' });
  }
  
  try {
    const calendars = await Calendar.find({
      $or: [
        { user: id },
        { systemCalendar: true }
      ]
    })
  
    const calendarIds = calendars.map(calendar => calendar._id);
  
    const events = await Event.find({
      calendar: {
        $in: calendarIds
      }
    }).sort({ start: -1 })
  
    return res.status(200).send({ data: events });
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const event = new Event(req.body);

    const createdEvent = await event.save();
    console.log('createdEvent', createdEvent)
    const trimmed = {
      _id: createdEvent._id,
      title: createdEvent.title,
      desc: createdEvent.desc,
      start: createdEvent.start,
      end: createdEvent.end,
      calendar: createdEvent.calendar
    }

    return res.status(200).send({ data: trimmed });
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (req, res,next) => {
  const eventId = req.params.id;

  try {
    const deletedEvent = await Event.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(eventId) });

    return res.status(200).send({ data: deletedEvent, message: 'Deleted event' });
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);
  payload.calendar = db.mongoose.Types.ObjectId(payload.calendar);
  payload.start = new Date(payload.start);
  payload.end = new Date(payload.end);

  try {
    const updatedEvent = await Event.findOneAndUpdate({ '_id': payload._id }, payload, { new: true });
    console.log('updatedEvent', updatedEvent)

    const trimmed = {
      _id: updatedEvent._id,
      title: updatedEvent.title,
      desc: updatedEvent.desc,
      start: updatedEvent.start,
      end: updatedEvent.end,
      calendar: updatedEvent.calendar
    }
  
    return res.status(200).send({ data: trimmed, message: 'Updated event' });
  } catch (err) {
    return next(err);
  }
};

const updateUsername = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

  try {
    User.findOne({
      '_id': payload._id
    })
      .exec(async (err, user) => {
        if (err) {
          return next(err);
        }
  
        user.username = payload.username;
  
        user.save(err => {
          if (err) {
            return next(err);
          }
  
          res.status(200).send({
            id: user._id,
            username: user.username,
            message: 'Username updated successfully!',
          });
        });
      });
  } catch (err) {
    return next(err);
  }
};

const updatePassword = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

  try {
    User.findOne({
      '_id': payload._id
    })
      .exec(async (err, user) => {
        if (err) {
          return next(err);
        }
  
        const passwordIsValid = await user.validatePassword(payload.password);
  
        if (!passwordIsValid) {
          return next(
            new AuthorizationError(
              'Invalid password',
              { errorCode: 'password' }
            )
          );
        }
  
        // If password is valid, update with new password
        user.password = payload.newPassword;
  
        user.save(err => {
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
  let id = req.body.user;

  try {
    const foundCalendars = await Calendar.find({
      $or: [
        { user: id },
        { systemCalendar: true }
      ]
    })
  
    let data = {
      name: req.body.name,
      color: `#${CALENDAR_COLORS[foundCalendars.length + 1]}`,
      visibility: true,
      user: id,
      userDefault: false,
      systemCalendar: false
    }
  
    const calendar = new Calendar(data);
  
    const createdCalendar = await calendar.save();
    console.log('createdCalendar', createdCalendar)

    const trimmed = {
      _id: createdCalendar._id,
      name: createdCalendar.name,
      color: createdCalendar.color,
      visibility: createdCalendar.visibility,
      user: createdCalendar.user
    }
  
    return res.status(200).send({ data: trimmed });
  } catch (err) {
    return next(err);
  }
};

const updateCalendar = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

  try {
    const updatedCalendar = await Calendar.findOneAndUpdate({ '_id': payload._id }, payload, { new: true });
    console.log('updatedCalendar', updatedCalendar)

    const trimmed = {
      _id: updatedCalendar._id,
      name: updatedCalendar.name,
      color: updatedCalendar.color,
      visibility: updatedCalendar.visibility,
      user: updatedCalendar.user
    }

    return res.status(200).send({ data: trimmed, message: 'Updated calendar' });
  } catch (err) {
    return next(err);
  }
};

const deleteCalendar = async (req, res, next) => {
  const calendarId = req.params.id;

  try {
    const deletedCalendar = await Calendar.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(calendarId) });

    return res.status(200).send({ data: deletedCalendar, message: 'Deleted calendar' });
  } catch (err) {
    return next(err);
  }
};

const userController = {
  allAccess,
  userAccess,
  adminAccess,
  moderatorAccess,
  retrieveEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  updateUsername,
  updatePassword,
  createCalendar,
  updateCalendar,
  deleteCalendar
}

export default userController;