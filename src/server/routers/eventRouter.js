import express from 'express';
import { authJwt } from 'server/middleware';
import EventController from 'server/controllers/EventController';

const router = express.Router();

// POST request to create event
router.post('/create', [authJwt.verifyToken], EventController.create);

// GET request to get events
router.post('/getall', [authJwt.verifyToken], EventController.getAll);

// POST request to update event
router.post('/update', [authJwt.verifyToken], EventController.update);

// DELETE request to delete event
router.delete('/delete', [authJwt.verifyToken], EventController.delete);

export default router;
