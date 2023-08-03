import express from 'express';
import { authJwt } from 'server/middleware';
import CalendarController from 'server/controllers/CalendarController';

const router = express.Router();

// POST request to create calendar
router.post('/', [authJwt.verifyToken], CalendarController.create);

// GET request to get all calendars
router.get('/user', [authJwt.verifyToken], CalendarController.getUserCalendars);

// PUT request to update calendar
router.put('/:calendarId', [authJwt.verifyToken, authJwt.verifyURIAuth], CalendarController.update);

// DELETE request to delete calendar
router.delete('/:calendarId', [authJwt.verifyToken, authJwt.verifyURIAuth], CalendarController.delete);

export default router;
