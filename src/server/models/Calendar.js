import mongoose from 'mongoose';

const calendarSchema = new mongoose.Schema({
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
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

let Calendar = mongoose.model('Calendar', calendarSchema);

export default Calendar;