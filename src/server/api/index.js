import express from 'express';
import calendarRouter from './calendar';
import userRouter from './user';

const router = express.Router();

router.get("/test",  async (req, res) => {
  console.log('/api/test hit')
  res.header("Content-Type",'application/json');
  res.send(JSON.stringify("Hello test", null, 4));
});

router.use("/calendar", calendarRouter);
router.use("/user", userRouter);

export default router;
