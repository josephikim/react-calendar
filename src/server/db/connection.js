import db from 'server/models';
import services from 'server/services';

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
    services.RoleService.initRoles();
    services.CalendarService.initCalendars();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

export default db;
