import db from 'server/models';
import { RoleService, CalendarService } from 'server/services';

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const Role = db.role;
const Calendar = db.calendar;

db.mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // initialize roles
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        RoleService.addRole('user');
        RoleService.addRole('moderator');
        RoleService.addRole('admin');
      }
    });
  })
  .then(() => {
    // initialize system calendars
    Calendar.countDocuments({ systemCalendar: true }, (err, count) => {
      if (!err && count === 0) {
        CalendarService.createSystemCalendar('US Holidays');
      }
    });
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

export default db;
