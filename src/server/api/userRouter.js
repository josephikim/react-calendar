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
userRouter.get(
  '/test/all',
  userController.allAccess
);

userRouter.get(
  '/test/user',
  [authJwt.verifyToken],
  userController.userAccess
);

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

// GET request for all events
userRouter.get(
  '/event',
  [authJwt.verifyToken],
  userController.retrieveEvents
);

// POST request to create event
userRouter.post(
  '/event', 
  [authJwt.verifyToken],
  userController.createEvent
);

// DELETE request to delete event
userRouter.delete(
  '/event/:id/delete',
  [authJwt.verifyToken],
  userController.deleteEvent
);

// POST request to update event
userRouter.post(
  '/event/:id/update',
  [authJwt.verifyToken],
  userController.updateEvent
);

// POST request to update username
userRouter.post(
  '/user/:id/username/update',
  [authJwt.verifyToken],
  userController.updateUsername
);

// POST request to update password
userRouter.post(
  '/user/:id/password/update',
  [authJwt.verifyToken],
  userController.updatePassword
);

export default userRouter;