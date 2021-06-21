const dotenv = require('dotenv').config({ path: '.env.development' })
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
    for (let i = 0; i < 50; i++) {
      const futureDate = faker.date.future();
      let start = new Date(futureDate)
      let end = new Date(futureDate)
      end = new Date(end.setHours(end.getHours() + 1));

      let newEvent = {
        title: faker.lorem.words(),
        desc: faker.lorem.text(),
        start,
        end
      }
      events.push(newEvent);
    }
    collection.insertMany(events, () => {
      client.close();
    });
    console.log("Database seeded!");
  } catch (err) {
    console.log(err.stack);
  }
}
seedDB();