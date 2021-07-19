import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true 
  },
  visibility: {
    type: Boolean,
    required: true,
    default: true
  },
  color: {
    type: String,
    required: true
  }
});

let Calendar = mongoose.model('Calendar', calendarSchema);

export default Calendar;