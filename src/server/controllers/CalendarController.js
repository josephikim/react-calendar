import CalendarService from 'server/services/CalendarService';
import UserService from 'server/services/UserService';
import db from 'server/models';

const calendarService = new CalendarService(db.Calendar);
const userService = new UserService(db.User);

class CalendarController {
  constructor(service) {
    this.service = service;
    this.userService = userService;
  }

  create = async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user_id: req.auth.user
      };

      await this.service.create(data);

      const userResponse = await this.userService.getOne(req.auth.user);

      return res.status(userResponse.statusCode).send(userResponse.data.calendarSettings);
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

export default new CalendarController(calendarService, userService);
