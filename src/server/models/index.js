import mongoose from 'mongoose';
import User from './User';
import Role from './Role';
import Event from './Event';

mongoose.Promise = global.Promise;

const db = {
  mongoose,
  user: User,
  role: Role,
  event: Event,
  ROLES: ['user', 'admin', 'moderator']
};

export default db;