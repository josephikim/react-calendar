import mongoose from 'mongoose';

const CalendarSchema = new mongoose.Schema ({
  name: { type: String, required: true },
  visibility: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Calendar', CalendarSchema);