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
  } catch (error) {
    console.error(error);
  }
};

// make a bunch of calendar events using API data
const makeEvents = async () => {
  let events = [];

  const calendar = await client.db(MONGO_DB).collection('calendars').find({ name: 'US Holidays' }).toArray();

  const calendarId = calendar[0]._id;

  const processedEvents = await getHolidays().then((response) => {
    const holidays = response.data.response.holidays;

    holidays.forEach((holiday) => {
      const event = {
        title: holiday.name,
        desc: holiday.description,
        start: new Date(holiday.date.iso),
        end: new Date(holiday.date.iso),
        allDay: true,
        calendarId: calendarId
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

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    // collection.drop();

    // Insert events into DB
    makeEvents().then((events) => {
      collection.insertMany(events, () => {
        client.close();
      });
      console.log('Database seeded!');
    });
  } catch (err) {
    console.log(err.stack);
  }
};

seedDB();
