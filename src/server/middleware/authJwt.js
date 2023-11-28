import jwt from 'jsonwebtoken';
import db from 'server/models';
import CalendarService from 'server/services/CalendarService';
import UserService from 'server/services/UserService';
import EventService from 'server/services/EventService';

const User = db.User;
const RefreshToken = db.RefreshToken;
const Role = db.Role;
const Calendar = db.Calendar;
const Event = db.Event;
const { TokenExpiredError } = jwt;

const calendarService = new CalendarService(Calendar);
const userService = new UserService(User, RefreshToken, Role);
const eventService = new EventService(Event);

const catchTokenError = (e, res) => {
  if (e instanceof TokenExpiredError) {
    return res.status(401).send({ message: 'Unauthorized! Access Token was expired!', errorCode: 'accesstoken' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!', errorCode: 'accesstoken' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!', errorCode: 'accesstoken' });
  }

  // Decode token and attach user info to request
  jwt.verify(token, process.env.JWT_SECRET_KEY, (e, decoded) => {
    if (e) {
      return catchTokenError(e, res);
    }

    req.auth = {
      user: decoded.id
    };

    return next();
  });
};

// Checks authed user against request params for resource authorization
// Can be replaced with an access control list or similar
const verifyURIAuth = async (req, res, next) => {
  const url = req.baseUrl + req.route.path;

  switch (url) {
    case `${req.baseUrl}/:userId`: {
      if (req.auth.user !== req.params.userId) {
        return res.status(403).send({ message: 'Requires admin role!', errorCode: 'role' });
      }
      return next();
    }

    case `${req.baseUrl}/:calendarId`: {
      // fetch target calendar
      const calendar = await calendarService.getOne(req.params.calendarId);

      if (req.auth.user !== calendar.data.user_id) {
        return res.status(403).send({ message: 'Requires admin role!', errorCode: 'role' });
      }
      return next();
    }

    case `${req.baseUrl}/:calendarId/settings`: {
      // fetch target user
      // Mongoose returns null for .findOne query with no matches
      const user = await User.findOne({
        _id: req.auth.user,
        'calendarSettings.calendar': {
          $eq: req.params.calendarId
        }
      });

      if (!user) {
        return res.status(403).send({ message: 'Requires admin role!', errorCode: 'role' });
      }
      return next();
    }

    case `${req.baseUrl}/:eventId`: {
      // fetch target event
      const event = await eventService.getOne(req.params.eventId);
      // fetch corresponding calendar
      const calendar = await calendarService.getOne(event.data.calendar);

      if (req.auth.user !== calendar.data.user_id) {
        return res.status(403).send({ message: 'Requires admin role!', errorCode: 'role' });
      }
      return next();
    }

    default:
      return res.status(403).send({ message: 'Requires admin role!', errorCode: 'role' });
  }
};

const isAdmin = (req, res, next) => {
  User.findById(req.auth.user).exec((e, user) => {
    if (e) {
      return next(e);
    }

    // Mongoose returns [] for .find query with no matches
    Role.find(
      {
        id: { $in: user.roles }
      },
      (e, roles) => {
        if (e) {
          return next(e);
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            return next();
          }
        }

        return res.status(403).send({ message: 'Require Admin Role!', errorCode: 'role' });
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.auth.user).exec((e, user) => {
    if (e) {
      return next(e);
    }

    // Mongoose returns [] for .find query with no matches
    Role.find(
      {
        id: { $in: user.roles }
      },
      (e, roles) => {
        if (e) {
          return next(e);
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            return next();
          }
        }

        return res.status(403).send({ message: 'Require Moderator Role!', errorCode: 'role' });
      }
    );
  });
};

const authJwt = {
  verifyToken,
  verifyURIAuth,
  isAdmin,
  isModerator
};

export default authJwt;
