import express from 'express';
import { authJwt } from 'server/middleware';
import EventController from 'server/controllers/EventController';

const router = express.Router();

// POST request to create event
router.post('/', [authJwt.verifyToken], EventController.create);

// GET request to get events
router.get('/all', [authJwt.verifyToken], EventController.getAll);

// PUT request to update event
router.put('/:id', [authJwt.verifyToken], EventController.update);

// DELETE request to delete event
router.delete('/:id', [authJwt.verifyToken], EventController.delete);

export default router;
