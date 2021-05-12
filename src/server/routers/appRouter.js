import express from 'express';

const router = express.Router();

// Home page route
router.get('/', function(req, res) {
  res.send('Calendar home page');
});

// About page route
router.get('/about', function(req, res) {
  res.send('Calendar about page');
});

export default appRouter;