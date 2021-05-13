import express from 'express';
import passport from 'passport';

import eventController from '../controllers/eventController';

const router = express.Router();

// Get events
router.get('/events', passport.authenticate('jwt',{session: false}), eventController);

export default apiRouter;