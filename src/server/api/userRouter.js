import express from 'express';
import { authJwt } from '../middleware';
import userController from '../controllers/userController';

const userRouter = express.Router();

// Set request headers
userRouter.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
})

// test routes
userRouter.get('/test/all', userController.allAccess);

userRouter.get('/test/user', [authJwt.verifyToken], userController.userAccess);

userRouter.get(
  '/test/mod',
  [authJwt.verifyToken, authJwt.isModerator],
  userController.moderatorAccess
);

userRouter.get(
  '/test/admin',
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.adminAccess
);

export default userRouter;