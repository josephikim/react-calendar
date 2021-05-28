import mongoose from 'mongoose';

const eventSchema = mongoose.Schema ({
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
});

// const eventSchema = new mongoose.Schema ({
//   title: { 
//     type: String, 
//     required: [true, 'Enter a title.'] 
//   },
//   desc: { 
//     type: String 
//   },
//   startDate: { 
//     type: Date, 
//     required: [true, 'Enter a start date.'] 
//   },
//   endDate: { 
//     type: Date, 
//     required: [true, 'Enter an end date.'] 
//   }
// }, {collection : 'Event'});

const Event = mongoose.model('Event', eventSchema);

// Event.getAll = () => {
//   console.log('Event.getAll hit')
//   return Event.find({});
// }

// Event.addEvent = (eventToAdd) => {
//   return Event.save(eventToAdd);
// }

// Event.updateEvent = (req) => {
//   return Event.findByIdAndUpdate(req.params.eventid, req.body, { new: true });
// }

// Event.removeEvent = (eventId) => {
//   return Event.remove({id: eventId});
// }


export default Event;