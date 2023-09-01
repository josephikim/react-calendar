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
    console.log('Connected to MongoDB');
    // initialize roles
    Role.countDocuments((err, count) => {
      if (count === 0) {
        roleService.create('user');
        roleService.create('moderator');
        roleService.create('admin');
      }
    });
  })
  .then(() => {
    // initialize system calendars
    Calendar.find({ user_id: 'system', name: 'US Holidays' })
      .countDocuments()
      .exec(function (err, count) {
        if (err) {
          throw new Error(err);
        }
        if (count === 0) {
          const data = {
            name: 'US Holidays',
            user_id: 'system'
          };

          calendarService.create(data);
          console.log('Created US Holidays calendar.');
        }
      });
  })
  .catch((e) => {
    console.error('Connection error', e);
    process.exit();
  });

export default db;
