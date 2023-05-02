import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter a name.']
  }
});

const Role = mongoose.model('Role', schema);

export default Role;
