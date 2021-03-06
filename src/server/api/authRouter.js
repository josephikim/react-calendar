import express from 'express';
import { verifyRegistration } from '../middleware';
import authController from '../controllers/authController';

const authRouter = express.Router();

// Set request headers
authRouter.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
})

// POST request to register user
authRouter.post(
  '/register',
  [
    verifyRegistration.checkDuplicateUsername,
    verifyRegistration.checkRolesExisted
  ],
  authController.register
);

// POST request to login user
authRouter.post('/login', authController.login);

export default authRouter;