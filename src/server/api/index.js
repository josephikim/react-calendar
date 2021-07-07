import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';

const apiRouter = express.Router();

apiRouter.get('/test',  async (req, res) => {
  console.log('/api/test hit')
  res.header('Content-Type','application/json');
  res.send(JSON.stringify('Hello test', null, 4));
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
