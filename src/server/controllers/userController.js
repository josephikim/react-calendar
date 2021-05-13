import async from 'async';
import passport from 'passport';
import Event from '../models';

const UserController = {}

UserController.index = (req, res) => {
  async.parallel({
    // user: function (callback) {
    //   User.findById({}, callback);
    // },
    // ...add other model data requests here
  }, function (err, results) {
    // res.render('index', { title: 'User Page', error: err, data: results });
  });
}

UserController.findById = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  try {
    const user = await User.findById(req.query.userId);
    // logger.info('found user...');
    res.send(user);
  }
  catch (err) {
    // logger.error('Error in getting user- ' + err);
    res.send('Got error in findById');
  }
}

UserController.create = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
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
    logger.info('Adding user...');
    // Generate JWT token
    const token = genToken(newUser);
    res.status(200).json({ token });
  }
  catch (err) {
    logger.error('Error in saving user- ' + err);
    res.send('Got error in save user');
  }
}

UserController.delete = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  let userId = User(req.body.userId);
  try {
    const removedUser = await User.removeUser(userId);
    logger.info('Deleted User-' + removedUser);
    res.send('User successfully deleted');
  }
  catch (err) {
    logger.error('Failed to delete User- ' + err);
    res.send('Delete failed..!');
  }
}

UserController.update = async (req, res, next) => {
  if (err) { return next(err); }
  if (!user) { return res.redirect('/login'); }
  // Validate request body
  if (!req.body) {
    return res.status(400).send({
      message: 'User details cannot be empty',
    })
  }
  let eventId = User(req.body.userId);
  try {
    const updatedUser = await User.updateUser(userId);
    logger.info('Updated User-' + updatedUser);
    res.send('User successfully updated');
  }
  catch (err) {
    logger.error('Failed to update User- ' + err);
    res.send('Update failed..!');
  }
}

export default UserController;

