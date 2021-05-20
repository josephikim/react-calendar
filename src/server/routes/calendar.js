import express from 'express';
import eventController from '../controllers/eventController';

const calendarRouter = express.Router();

// GET calendar home page
calendarRouter.get('/event', eventController.findAll);

// POST request to create event
calendarRouter.post('/event/create', eventController.create);

// POST request to delete event
calendarRouter.post('/event/:id/delete', eventController.delete);

// GET request to update event
calendarRouter.get('/event/:id/update', eventController.update);

export default calendarRouter;