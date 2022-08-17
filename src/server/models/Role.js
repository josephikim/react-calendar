import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter a name.']
  }
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
