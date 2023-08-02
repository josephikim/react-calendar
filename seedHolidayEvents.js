const dotenv = require('dotenv').config({ path: '.env.production' });
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
const API_KEY = process.env.CALENDARIFIC_KEY;

const uri = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API call for holidays data
const getHolidays = () => {
  try {
    return axios.get('https://calendarific.com/api/v2/holidays', {
      params: {
        api_key: API_KEY,
        country: 'US',
        year: 2023,
        type: 'national'
      }
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// make a bunch of calendar events using API data
const makeEvents = async () => {
  const events = [];

  // check if 'US Holidays' calendar exists in db
  const calendar = await client
    .db(MONGO_DB)
    .collection('calendars')
    .findOne({ name: 'US Holidays', user_id: 'system' });

  if (!calendar || !Object.keys(calendar).includes('_id')) return;

  await getHolidays().then((response) => {
    const holidays = response.data.response.holidays;

    holidays.forEach((holiday) => {
      const startDate = new Date(holiday.date.iso);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      const event = {
        title: holiday.name,
        desc: holiday.description,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        allDay: true,
        calendar: calendar._id
      };
      events.push(event);
    });
  });

  return events;
};

const seedDB = async () => {
  try {
    await client.connect();
    console.log('Connected correctly to server');
    const collection = client.db(MONGO_DB).collection('events');

    // Insert events into DB
    makeEvents().then((events) => {
      collection.insertMany(events, () => {
        client.close();
      });
      console.log('Database seeded!');
    });
  } catch (e) {
    console.log(e.stack);
    throw e;
  }
};

seedDB();
