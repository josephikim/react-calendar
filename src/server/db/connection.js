import db from 'server/models';
import RoleService from 'server/services/RoleService';
import CalendarService from 'server/services/CalendarService';

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const mongoose = db.mongoose;
const Role = db.Role;
const Calendar = db.Calendar;

const roleService = new RoleService(Role);
const calendarService = new CalendarService(Calendar);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // initialize roles
    Role.countDocuments((e, count) => {
      if (!e && count === 0) {
        roleService.create('user');
        roleService.create('moderator');
        roleService.create('admin');
      }
    });
  })
  .then(() => {
    // initialize system calendars
    Calendar.countDocuments({ systemCalendar: true }, (e, count) => {
      if (!e && count === 0) {
        const data = {
          name: 'US Holidays',
          user: null,
          visibility: true
        };

        calendarService.create(data);
      }
    });
  })
  .catch((e) => {
    console.error('Connection error', e);
    process.exit();
  });

export default db;
