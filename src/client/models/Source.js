import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SourceSchema = new Schema ({
  name: { type: String, required: true },
  visibility: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('Source', SourceSchema)