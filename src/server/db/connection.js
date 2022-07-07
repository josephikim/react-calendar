import db from '../models';
import { systemColors } from '../../config/appConfig';

const Role = db.role;
const Calendar = db.calendar;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

db.mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    initRoles();
    initCalendars();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

const initRoles = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log('added "user" to roles collection');
      });

      new Role({
        name: 'moderator'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log('added "moderator" to roles collection');
      });

      new Role({
        name: 'admin'
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log('added "admin" to roles collection');
      });
    }
  });
};

const initCalendars = () => {
  Calendar.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Calendar({
        name: 'US Holidays',
        color: `#${systemColors[0]}`,
        user: null,
        systemCalendar: true
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log('added "US Holidays" to calendars collection');
      });
    }
  });
};

export default db;
