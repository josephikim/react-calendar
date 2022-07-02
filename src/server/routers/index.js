import express from 'express';
import userRouter from './userRouter';
import authRouter from './authRouter';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
