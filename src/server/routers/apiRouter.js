import express from 'express';
import eventController from '../controllers/eventController';

const router = express.Router();

// Get events
router.get('/events', eventController);

export default apiRouter;