import db from 'server/models';
import calendarService from './calendarService.js';
import eventService from './eventService.js';
import refreshTokenService from './refreshTokenService.js';
import roleService from './roleService.js';
import userService from './userService.js';

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
