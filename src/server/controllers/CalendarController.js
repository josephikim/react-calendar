import CalendarService from 'server/services/CalendarService';
import db from 'server/models';

const calendarService = new CalendarService(db.Calendar);

class CalendarController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll(req.id);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  create = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user: req.id
      };

      const response = await this.service.create(data);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.body.id, req.body.name);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const response = await this.service.delete(req.query.id);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new CalendarController(calendarService);
