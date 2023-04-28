import CalendarService from 'server/services/CalendarService';
import db from 'server/models';

const calendarService = new CalendarService(db.Calendar);

class CalendarController {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll(req.query.id);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.body.id, req.body.name);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const response = await this.service.delete(req.query.id);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };
}

export default new CalendarController(calendarService);
