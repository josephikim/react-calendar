import express from 'express';
import Event from '../models/Event';
import { ObjectId } from 'mongodb';

const calendarRouter = express.Router();

// GET request for all events
calendarRouter.get("/event", async (req, res) => {
  const events = await Event.find({}).sort({ start: -1 });
  return res.send({data: events});
});

// POST request to create event
calendarRouter.post('/event', async (req, res) => {
  const createdEvent = new Event(req.body)
  await createdEvent.save();
  return res.send({data: 
    {
      _id: createdEvent._id,
      title: createdEvent.title,
      desc: createdEvent.desc,
      start: createdEvent.start,
      end: createdEvent.end
    }
  });
});       

// POST request to delete event
calendarRouter.post('/event/:id/delete', async (req, res) => {
  const eventId = req.params.id;
  const deletedEvent = await Event.findOneAndDelete({ _id: ObjectId(eventId)}, (err, doc) => {
    if (err) {
      return reject(err);
    }
    return res.send({data: doc, msg: "Deleted Event"});
  });
});

// GET request to update event
calendarRouter.post('/event/:id/update', async (req, res) => {
  const payload = req.body;
  payload._id = ObjectId(payload._id);
  payload.start = new Date(payload.start)
  payload.end = new Date(payload.end)
  const updatedEvent = await Event.findOneAndUpdate({"_id" : payload._id}, payload, {new: true}, (err, doc) => {
    return res.send({
      data: {
        _id: doc._id,
        title: doc.title,
        desc: doc.desc,
        start: doc.start,
        end: doc.end
      },
      msg: "Updated Event"
    });
  });
});

export default calendarRouter;