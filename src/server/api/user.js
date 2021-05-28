import express from 'express';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

// POST request to create user
userRouter.post('/user/create', async (req, res) => {
  const { email, password } = req.body;
  //Check If User Exists
  let foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(403).json({ error: 'Email is already in use' });
  }

  const genToken = user => {
    return jwt.sign({
      iss: 'Joseph Kim',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    }, 'mysecretket');
  }

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    // Generate JWT token
    const token = genToken(newUser);
    res.status(200).json({ token });
  }
  catch (err) {
    res.send('Got error in save user');
  }
});

// POST request to delete user
userRouter.post('/user/:id/delete', async (req, res) => {
  let userId = req.body.userId;
  try {
    const removedUser = await User.removeUser(userId);
    res.send('User successfully deleted');
  }
  catch (err) {
    res.send('Delete failed..!');
  }
});

// GET request to update user
userRouter.get('/user/:id/update', async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'User details cannot be empty',
    })
  }
  let userId = req.body.userId;
  try {
    const updatedUser = await User.updateUser(userId);
    res.send('User successfully updated');
  }
  catch (err) {
    res.send('Update failed..!');
  }
});

export default userRouter;