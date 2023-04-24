import db from 'server/models';
import calendarService from './CalendarService.js';
import eventService from './EventService.js';
import refreshTokenService from './RefreshTokenService.js';
import roleService from './RoleService.js';
import userService from './UserService.js';

const Calendar = db.calendar;
const Event = db.event;
const RefreshToken = db.refreshToken;
const Role = db.role;
const User = db.user;

const CalendarService = calendarService(Calendar);
const EventService = eventService(Event);
const RefreshTokenService = refreshTokenService(RefreshToken);
const RoleService = roleService(Role);
const UserService = userService(User);

export { CalendarService, EventService, RefreshTokenService, RoleService, UserService };
