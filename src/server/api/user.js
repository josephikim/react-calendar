import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

// POST request to register user
userRouter.post('/register', async (req, res) => {
  const { username, password, passwordConfirm } = req.body;

  // If user exists, send error msg
  let foundUser = await User.findOne({ username });
  
  if (foundUser) {
    return res.status(403).send({ error: 'Username is already in use' });
  }

  const genToken = user => {
    const options = {
      iss: 'React Calendar',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    }

    return jwt.sign(options, 'mysecretkey');
  }

  try {
    const newUser = new User({ username, password, passwordConfirm });
    await newUser.save();

    // Generate JWT token
    const token = genToken(newUser);

    return res.status(200).json({ data: newUser, msg: "User registered", token });
  }
  catch (err) {
    res.send({ error: err });
  }
});

// POST request to login user
userRouter.post('/login', async (req, res) => {
  const { username, password, passwordConfirm } = req.body;
  // If user not found, send error msg
  let foundUser = await User.findOne({ username });
  if (!foundUser) {
    return res.status(403).send({ error: 'User not found' });
  }

  // try {
  //   const newUser = new User({ username, password, passwordConfirm });
  //   await newUser.save();
  //   // Generate JWT token
  //   const token = genToken(newUser);
  //   // res.status(200).json({ token });
  //   return res.status(200).send({data: newUser, msg: "User registered", token});
  // }
  // catch (err) {
  //   res.send({ error: err });
  // }
});

// POST request to delete user
// userRouter.post('/:id/delete', async (req, res) => {
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
// userRouter.get('/:id/update', async (req, res) => {
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

export default userRouter;