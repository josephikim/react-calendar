import express from 'express';
import { authJwt, verifyRegistration } from 'server/middleware';
import UserController from 'server/controllers/UserController';

const router = express.Router();

// POST request to register user
router.post(
  '/register',
  [verifyRegistration.checkDuplicateUsername, verifyRegistration.checkRolesExist],
  [UserController.register, UserController.login]
);

// POST request to login user
router.post('/login', UserController.login);

// POST request to refresh token
router.post('/refreshtoken', UserController.refreshToken);

// POST request to update user
router.post('/update', [authJwt.verifyToken], UserController.update);

export default router;
