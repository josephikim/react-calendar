import mongoose from 'mongoose';
import User from './User';
import Role from './Role';
import Event from './Event';
import Calendar from './Calendar';
import RefreshToken from './RefreshToken';

mongoose.Promise = global.Promise;

const db = {
  mongoose,
  User,
  Role,
  Event,
  Calendar,
  RefreshToken,
  ROLES: ['user', 'admin', 'moderator']
};

export default db;
