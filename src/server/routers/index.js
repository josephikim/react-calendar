import express from 'express';
import userRouter from './userRouter';
import calendarRouter from './calendarRouter';
import eventRouter from './eventRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/calendars', calendarRouter);
router.use('/events', eventRouter);

export default router;
