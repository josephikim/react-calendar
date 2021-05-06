import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EventSchema = new Schema ({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Event', EventSchema)