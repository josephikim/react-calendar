import EventService from 'server/services/EventService';
import CalendarService from 'server/services/CalendarService';
import db from 'server/models';

const eventService = new EventService(db.Event);
const calendarService = new CalendarService(db.Calendar);

class EventController {
  constructor(service, calendarService) {
    this.service = service;
    this.calendarService = calendarService;
  }

  getAll = async (req, res, next) => {
    try {
      const calendars = await this.calendarService.getAll(req.user.id);

      if (!calendars || calendars.length < 1) {
        throw new NotFoundError('No matching calendars found', { errorCode: 'calendar' });
      }

      const calendarIds = calendars.data.map((calendar) => calendar.id);
      const response = await this.service.getAll(calendarIds);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.params.id, req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const response = await this.service.delete(req.params.id);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new EventController(eventService, calendarService);
