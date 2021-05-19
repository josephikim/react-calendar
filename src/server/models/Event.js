import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  desc: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
}, {collection : 'Event'});

let EventsModel = mongoose.model('Event', EventSchema);

EventsModel.getAll = (query) => {
  return EventsModel.find(query);
}

EventsModel.addEvent = (eventToAdd) => {
  return eventToAdd.save();
}

EventsModel.updateEvent = (req) => {
  return EventsModel.findByIdAndUpdate(req.params.eventid, req.body, { new: true });
}

EventsModel.removeEvent = (eventId) => {
  return EventsModel.remove({id: eventId});
}


export default EventsModel;