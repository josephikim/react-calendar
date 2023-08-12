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

  create = async (req, res, next) => {
    try {
      const response = await this.service.create(req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  getUserEvents = async (req, res, next) => {
    try {
      const calendars = await this.calendarService.getUserCalendars(req.auth.user);

      if (!calendars || calendars.length < 1) {
        throw new NotFoundError('No matching calendars found', { errorCode: 'calendar' });
      }

      const calendarIds = calendars.data.map((calendar) => calendar.id);

      const response = await this.service.getUserEvents(calendarIds);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  update = async (req, res, next) => {
    try {
      const response = await this.service.update(req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const response = await this.service.delete(req.params.eventId);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new EventController(eventService, calendarService);
