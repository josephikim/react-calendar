import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import '../config/authConfig';

const authRouter = express.Router();

// POST request to register user
authRouter.post('/register', async (req, res) => {
  const { username, password, passwordConfirm } = req.body;

  // If user exists, send error msg
  let foundUser = await User.findOne({ username });
  
  if (foundUser) {
    return res.status(403).send({ error: 'Username is already in use' });
  }

  try {
    const newUser = new User({ username, password, passwordConfirm });
    await newUser.save();

    return res.status(200).json({ data: newUser, msg: 'User registered' });
  }
  catch (err) {
    res.send({ error: err });
  }
});

// POST request to login user
authRouter.post('/login', async (req, res) => {
  const { username, password, passwordConfirm } = req.body;
  // If user not found, send error msg
  let foundUser = await User.findOne({ username });
  if (!foundUser) {
    return res.status(403).send({ error: 'User not found' });
  }

  const passwordIsValid = bcrypt.compareSync(
    password,
    foundUser.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: 'Invalid Password!'
    });
  }

  const genToken = user => {
    const options = {
      iss: 'React Calendar',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    }
    
    return jwt.sign(options, SECRET);
  }

  // Generate JWT token
  const token = genToken(foundUser);

  return res.status(200).send({
    id: foundUser._id,
    username: foundUser.username,
    accessToken: token
  });
});

// POST request to delete user
// authRouter.post('/:id/delete', async (req, res) => {
//   let userId = req.body.userId;
//   try {
//     const removedUser = await User.removeUser(userId);
//     res.send('User successfully deleted');
//   }
//   catch (err) {
//     res.send('Delete failed..!');
//   }
// });

// GET request to update user
// authRouter.get('/:id/update', async (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: 'User details cannot be empty',
//     })
//   }
//   let userId = req.body.userId;
//   try {
//     const updatedUser = await User.updateUser(userId);
//     res.send('User successfully updated');
//   }
//   catch (err) {
//     res.send('Update failed..!');
//   }
// });

export default authRouter;