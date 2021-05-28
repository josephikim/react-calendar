import express from 'express';
import Event from '../models/Event';

const calendarRouter = express.Router();

// GET request for all events
calendarRouter.get("/event", async (req, res) => {
  const events = await Event.find({}).sort({ startDate: -1 });
  return res.send({data: events});
});

// POST request to create event
calendarRouter.post('/event', async (req, res) => {
  const createdEvent = new Event(req.body);
  await createdEvent.save();
  return res.send({data: createdEvent});
});       

// POST request to delete event
calendarRouter.post('/event/:id/delete', async (req, res) => {
  const eventId = req.body.eventId;
  const deletedEvent = await Event.removeEvent(eventId);
  return res.send({data: deletedEvent, msg: "Deleted Event"});
});

// GET request to update event
calendarRouter.get('/event/:id/update', async (req, res) => {
  const eventId = req.body.eventId;
  const updatedEvent = await Event.updateEvent(eventId);
  return res.send({data: updatedEvent, msg: "Updated Event"});
});

export default calendarRouter;