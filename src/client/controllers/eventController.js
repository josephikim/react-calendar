var passport = require('passport');
var db = require('../models');

const EventController = {
  find: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        res.send(500).send(err)
      }
      if (info) {
        res.status(403).send(info)
      }
      if (!user) {
        res.status(401).send('user not found')
      }
      if (user) {
        // Check if sources are provided, then run query
        let sources = req.query.source

        if (sources !== undefined) {
          db.Event.find({ 'source': { $in: sources } })
            .then(events => {
              res.send(events)
            })
            .catch(error => {
              res.status(422).json(error)
            });
        } else {
          db.Event.find(req.query)
            .sort({
              date: -1,
            })
            .then(dbEvent => res.send(dbEvent))
            .catch(err => res.status(422).json(err))
        }
      }
    })(req, res, next)
  },
  create: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (info !== undefined) {
        res.status(403).send(info.message)
      } else {
        db.Event.create(req.body)
          .then(dbEvent => res.json(dbEvent))
          .catch(err => {
            res.status(422).send(err)
            if (err.code === 11000) {
              // handle duplication error
            }
          })
      }
    })(req, res, next)
  },
  delete: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (info !== undefined) {
        return res.status(403).send(info.message)
      }
      db.Event.findByIdAndRemove(req.params.eventid)
        .then(dbEvent => {
          res.json(dbEvent)
        })
        .catch(err => {
          if (err) return next(err)
        })
    })(req, res, next)
  },
  update: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      // Validate Request
      if (!req.body) {
        return res.status(400).send({
          message: 'Event details cannot be empty',
        })
      }
      if (info !== undefined) {
        res.status(403).send(info.message)
      } else {
        // Find event and add the request body
        db.Event.findByIdAndUpdate(req.params.eventid, req.body, { new: true })
          .then(dbEvent => {
            if (!dbEvent) {
              return res.status(404).send({
                message: 'Event not found with id ' + req.params.eventid,
              })
            }
            res.send(dbEvent)
          })
          .catch(err => {
            if (err.kind === 'ObjectId') {
              return res.status(404).send({
                message: 'Event not found with id ' + req.params.eventid,
              })
            }
            return res.status(500).send({
              message: 'error updating event with id ' + req.params.eventid,
            })
          })
      }
    })(req, res, next)
  }
}

module.exports = EventController;

