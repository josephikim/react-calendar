import passport from 'passport';
import Event from '../models';

const EventsController = {}

EventsController.find = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  try {
    const events = await Event.getAll(req.query).sort({ date: -1 });
    // logger.info('sending all events...');
    res.send(cars);
  }
  catch (err) {
    // logger.error('Error in getting events- ' + err);
    res.send('Got error in getAll');
  }
}

EventsController.create = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  let eventToAdd = Event(req.body);
  try {
    const savedEvent = await Event.addevent(eventToAdd);
    logger.info('Adding event...');
    res.send('added: ' + savedEvent);
  }
  catch (err) {
    logger.error('Error in saving event- ' + err);
    res.send('Got error in addEvent');
  }
}

EventsController.delete = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  let eventId = Event(req.body.eventId);
  try {
    const removedEvent = await Event.removeEvent(eventId);
    logger.info('Deleted event-' + removedEvent);
    res.send('Event successfully deleted');
  }
  catch (err) {
    logger.error('Failed to delete event- ' + err);
    res.send('Delete failed..!');
  }
}

EventsController.update = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  // Validate request body
  if (!req.body) {
    return res.status(400).send({
      message: 'Event details cannot be empty',
    })
  }
  let eventId = Event(req.body.eventId);
  try {
    const updatedEvent = await Event.updateEvent(eventId);
    logger.info('Updated event-' + updatedEvent);
    res.send('Event successfully updated');
  }
  catch (err) {
    logger.error('Failed to update event- ' + err);
    res.send('Update failed..!');
  }
}

module.exports = EventsController;

