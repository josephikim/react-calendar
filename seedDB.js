const dotenv = require('dotenv').config({ path: '.env.production' })
const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;

const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;

async function seedDB() {
  const uri = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected correctly to server");
    const collection = client.db("react-calendar").collection("events");
    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    collection.drop();
    // make a bunch of calendar events
    let events = [];
    for (let i = 0; i < 99; i++) {
      const futureDate = faker.date.future();
      const startDate = new Date(futureDate)
      const endDate = new Date(futureDate)
      let newEvent = {
        title: faker.lorem.words(),
        desc: faker.lorem.text(),
        startDate,
        endDate
      }
      events.push(newEvent);
    }
    const loadedEvents = await collection.insertMany(events);
    console.log("Database seeded!");
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
}
seedDB();