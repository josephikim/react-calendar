import db from 'server/models';

const getEvents = (Event) => (calendars) => {
  return Event.find({
    calendarId: {
      $in: calendars
    }
  })
    .select('-__v')
    .sort({ start: -1 });
};

const createEvent = (Event) => (payload) => {
  const _obj = new Event({
    title: payload.title,
    desc: payload.desc,
    start: payload.start,
    end: payload.end,
    allDay: payload.allDay,
    calendar: payload.calendar
  });

  return _obj.save();
};

const updateEvent = (Event) => (id, payload) => {
  payload.calendar = db.mongoose.Types.ObjectId(payload.calendar);
  payload.start = new Date(payload.start);
  payload.end = new Date(payload.end);

  return Event.findOneAndUpdate({ _id: db.mongoose.Types.ObjectId(id) }, payload, { new: true });
};

const deleteEvent = (Event) => (id) => {
  return Event.findOneAndDelete({ _id: db.mongoose.Types.ObjectId(id) });
};

const EventService = (Event) => {
  return {
    getEvents: getEvents(Event),
    createEvent: createEvent(Event),
    updateEvent: updateEvent(Event),
    deleteEvent: deleteEvent(Event)
  };
};

export default EventService;
