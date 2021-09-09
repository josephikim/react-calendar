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

const retrieveData = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(500).send({ message: 'GET request failed. Please check your query and try again.' });
  }

  const calendars = await Calendar.find({ 
    $or: [
      { user: id },
      { user: null },
      { user: { $exists: false } }
    ]
  })
    
  const calendarIds = calendars.map(calendar => calendar._id);

  const events = await Event.find({
    calendar: {
      $in: calendarIds
    }
  }).sort({ start: -1 })

  return res.status(200).send({ data: { calendars, events } });
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);

  const createdEvent = await event.save();

  const trimmed = {
    _id: createdEvent._id,
    title: createdEvent.title,
    desc: createdEvent.desc,
    start: createdEvent.start,
    end: createdEvent.end
  }

  return res.status(200).send({ data: trimmed });
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;

  const deletedEvent = await Event.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(eventId) });

  return res.status(200).send({ data: deletedEvent, message: 'Deleted event' });
};

const updateEvent = async (req, res) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);
  payload.start = new Date(payload.start)
  payload.end = new Date(payload.end)

  const updatedEvent = await Event.findOneAndUpdate({ '_id': payload._id }, payload, { new: true });

  const trimmed = {
    _id: updatedEvent._id,
    title: updatedEvent.title,
    desc: updatedEvent.desc,
    start: updatedEvent.start,
    end: updatedEvent.end
  }

  return res.status(200).send({ data: trimmed, message: 'Updated event' });
};

const updateUsername = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

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
};

const updatePassword = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

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
};

const createCalendar = async (req, res) => {
  let id = req.body.user;
 
  const foundCalendars = await Calendar.find({ 
    $or: [
      { user: id },
      { user: null },
      { user: { $exists: false } }
    ]
  })

  let data = {
    name: req.body.name,
    color: `#${CALENDAR_COLORS[foundCalendars.length + 1]}`,
    visibility: true,
    user: id
  }

  const calendar = new Calendar(data);

  const createdCalendar = await calendar.save();

  const trimmed = {
    _id: createdCalendar._id,
    name: createdCalendar.name,
    color: createdCalendar.color,
    visibility: createdCalendar.visibility,
    user: createdCalendar.user
  }

  return res.status(200).send({ data: trimmed });
};

const updateCalendar = async (req, res, next) => {
  const payload = req.body;
  payload._id = db.mongoose.Types.ObjectId(payload._id);

  try {
    const updatedCalendar = await Calendar.findOneAndUpdate({ '_id': payload._id }, payload, { new: true });

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

const deleteCalendar = async (req, res) => {
  const calendarId = req.params.id;

  const deletedCalendar = await Calendar.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(calendarId) });

  return res.status(200).send({ data: deletedCalendar, message: 'Deleted calendar' });
};

const userController = {
  allAccess,
  userAccess,
  adminAccess,
  moderatorAccess,
  retrieveData,
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