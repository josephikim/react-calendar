import express from 'express';
import User from '../Models/User';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import '../auth/passport';

const router = express.Router();

// Home page route
router.get('/', function (req, res) {
  res.send('Calendar home page');
});

// About page route
router.get('/about', function (req, res) {
  res.send('Calendar about page');
});

// Auth routes
genToken = user => {
  return jwt.sign({
    iss: 'Joseph Kim',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, 'mysecretket');
}

router.post('/register', async function (req, res, next) {
  const { email, password } = req.body;

  //Check If User Exists
  let foundUser = await User.findOne({ email });
  if (foundUser) {
    return res.status(403).json({ error: 'Email is already in use' });
  }

  const newUser = new User({ email, password })
  await newUser.save()
  // Generate JWT token
  const token = genToken(newUser)
  res.status(200).json({ token })
});

router.get('/secret', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json("Secret Data")
})


export default appRouter;