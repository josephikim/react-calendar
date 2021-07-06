import express from 'express';
import Event from '../models/Event';
import { ObjectId } from 'mongodb';

const userRouter = express.Router();

// GET request for all events
userRouter.get("/event", async (req, res) => {
  const events = await Event.find({}).sort({ start: -1 });
  
  return res.send({ data: events });
});

// POST request to create event
userRouter.post('/event', async (req, res) => {
  const event = new Event(req.body);

  const createdEvent = await event.save();

  const trimmed = {
    _id: createdEvent._id,
    title: createdEvent.title,
    desc: createdEvent.desc,
    start: createdEvent.start,
    end: createdEvent.end
  }

  return res.send({ data: trimmed });
});       

// POST request to delete event
userRouter.post('/event/:id/delete', async (req, res) => {
  const eventId = req.params.id;

  const deletedEvent = await Event.findOneAndDelete({ _id: ObjectId(eventId)});

  return res.send({ data: deletedEvent, msg: "Deleted event" });
});

// GET request to update event
userRouter.post('/event/:id/update', async (req, res) => {
  const payload = req.body;
  payload._id = ObjectId(payload._id);
  payload.start = new Date(payload.start)
  payload.end = new Date(payload.end)

  const updatedEvent = await Event.findOneAndUpdate({"_id" : payload._id}, payload, {new: true});

  const trimmed = {
    _id: updatedEvent._id,
    title: updatedEvent.title,
    desc: updatedEvent.desc,
    start: updatedEvent.start,
    end: updatedEvent.end
  }
  
  return res.send({ data: trimmed, msg: "Updated event" });
});

export default userRouter;