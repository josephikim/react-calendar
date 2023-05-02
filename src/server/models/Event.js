import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Enter a title.']
  },
  desc: {
    type: String
  },
  start: {
    type: Date,
    required: [true, 'Enter a start date.']
  },
  end: {
    type: Date,
    required: [true, 'Enter an end date.']
  },
  allDay: {
    type: Boolean,
    required: true,
    default: false
  },
  calendar: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Enter a calendar for this event'],
    ref: 'Calendar'
  }
});

const Event = mongoose.model('Event', schema);

export default Event;
