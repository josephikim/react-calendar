import express from 'express';
import jwt from 'jsonwebtoken';
import userController from '../controllers/userController';

const usersRouter = express.Router();

// POST request to create user
usersRouter.post('/user/create', userController.create);

// POST request to delete user
usersRouter.post('/user/:id/delete', userController.delete);

// GET request to update user
usersRouter.get('/user/:id/update', userController.update);

export default usersRouter;