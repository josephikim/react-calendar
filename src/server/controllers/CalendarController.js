import CalendarService from 'server/services/CalendarService';
import db from 'server/models';

const calendarService = new CalendarService(db.Calendar);

class CalendarController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user: req.auth.user
      };

      const response = await this.service.create(data);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  getUserCalendars = async (req, res, next) => {
    try {
      const response = await this.service.getUserCalendars(req.auth.user);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.params.calendarId, req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const response = await this.service.delete(req.params.calendarId);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new CalendarController(calendarService);
