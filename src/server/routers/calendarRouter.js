import express from 'express';
import { authJwt } from 'server/middleware';
import CalendarController from 'server/controllers/CalendarController';

const router = express.Router();

// POST request to create calendar
router.post('/create', [authJwt.verifyToken], CalendarController.create);

// GET request to get calendars
router.post('/getall', [authJwt.verifyToken], CalendarController.getAll);

// POST request to update calendar
router.post('/update', [authJwt.verifyToken], CalendarController.update);

// DELETE request to delete calendar
router.delete('/delete', [authJwt.verifyToken], CalendarController.delete);

export default router;
