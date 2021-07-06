import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../Models/User';
import '../config/authConfig';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt; 

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET
},
  function (jwtPayload, done) {
    return User.findById(jwtPayload.sub)
      .then(user => {
        return done(null, user);
      }
      ).catch(err => {
        return done(err);
      });
  }
))