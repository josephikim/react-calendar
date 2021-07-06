const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_URL = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

const dbConfig = {
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
  MONGO_URL
}

export default dbConfig;