import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';

const router = express.Router();

router.get('/test',  async (req, res) => {
  console.log('/api/test hit')
  res.header('Content-Type','application/json');
  res.send(JSON.stringify('Hello test', null, 4));
});

router.use('/user', userRouter);
router.use('/auth', authRouter);

export default router;
