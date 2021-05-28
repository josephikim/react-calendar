import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema ({
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

const Event = mongoose.model('Event', eventSchema);

export default Event;