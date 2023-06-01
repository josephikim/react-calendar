import EventService from 'server/services/EventService';
import db from 'server/models';

const eventService = new EventService(db.Event);

class EventController {
  constructor(service) {
    this.service = service;
  }

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body);

      await res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const response = await this.service.getAll(req.query.id);

      return res.status(200).send(response);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const result = await this.service.update(req.body.id, req.body.data);

      return res.status(200).send(result);
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

export default new EventController(eventService);
