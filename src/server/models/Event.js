import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema ({
  title: { 
    type: String, 
    required: [true, 'Enter a title.'] 
  },
  desc: { 
    type: String 
  },
  startDate: { 
    type: Date, 
    required: [true, 'Enter a start date.'] 
  },
  endDate: { 
    type: Date, 
    required: [true, 'Enter an end date.'] 
  }
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