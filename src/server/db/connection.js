import db from '../models';
import { MONGO_URL } from '../../config/dbConfig';
import { systemColors } from '../../config/appConfig';

const Role = db.role;
const Calendar = db.calendar;

db.mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initialRoles();
    initialCalendars();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

const initialRoles = () => {
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

const initialCalendars = () => {
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
