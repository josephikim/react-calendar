import db from 'server/models';
import CalendarService from './CalendarService.js';
import UserService from './UserService.js';
import RefreshTokenService from './RefreshTokenService.js';
import RoleService from './RoleService.js';
import EventService from './EventService.js';

const Calendar = db.calendar;
const User = db.user;
const RefreshToken = db.refreshToken;
const Event = db.event;
const Role = db.role;

export default {
  CalendarService: CalendarService(Calendar),
  UserService: UserService(User),
  RefreshTokenService: RefreshTokenService(RefreshToken),
  RoleService: RoleService(Role),
  EventService: EventService(Event)
};
