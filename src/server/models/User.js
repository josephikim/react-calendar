import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, 
  }
})

let UsersModel = mongoose.model('User', UserSchema);

UsersModel.get = (query) => {
  return UsersModel.find(query);
}

UsersModel.addUser = (userToAdd) => {
  return userToAdd.save();
}

UsersModel.updateUser = (req) => {
  return UsersModel.findByIdAndUpdate(req.params.userid, req.body, { new: true });
}

UsersModel.removeUser = (userId) => {
  return UsersModel.remove({id: userId});
}

export default UsersModel;