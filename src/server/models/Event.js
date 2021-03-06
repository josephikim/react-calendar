import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema ({
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
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;