import express from 'express';
import userRouter from './userRouter';
import calendarRouter from './calendarRouter';
import eventRouter from './eventRouter';

const router = express.Router();

router.use('/user', userRouter);
router.use('/calendar', calendarRouter);
router.use('/event', eventRouter);

export default router;
