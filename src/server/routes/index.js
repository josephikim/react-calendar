import express from 'express';
import passport from 'passport';

const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res) {
  res.redirect('/calendar');
});

// Checking auth
indexRouter.get('/secret', passport.authenticate('jwt',{session: false}),(req,res)=>{
  res.json("Secret Data")
})

export default indexRouter;