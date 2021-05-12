import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema ({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Event', EventSchema);