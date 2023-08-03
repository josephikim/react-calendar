import express from 'express';
import { authJwt } from 'server/middleware';
import EventController from 'server/controllers/EventController';

const router = express.Router();

// POST request to create event
router.post('/', [authJwt.verifyToken], EventController.create);

// GET request to get user events
router.get('/user', [authJwt.verifyToken], EventController.getUserEvents);

// PUT request to update event
router.put('/:eventId', [authJwt.verifyToken, authJwt.verifyURIAuth], EventController.update);

// DELETE request to delete event
router.delete('/:eventId', [authJwt.verifyToken, authJwt.verifyURIAuth], EventController.delete);

export default router;
