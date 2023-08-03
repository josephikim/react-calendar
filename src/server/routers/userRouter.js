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

// POST request to login user (returns user object)
router.post('/login', UserController.login);

// POST request to refresh token
router.post('/refreshtoken', UserController.refreshToken);

// PUT request to update user
router.put('/:userId', [authJwt.verifyToken, authJwt.verifyURIAuth], UserController.update);

export default router;
