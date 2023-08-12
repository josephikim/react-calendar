import CalendarService from 'server/services/CalendarService';
import UserService from 'server/services/UserService';
import db from 'server/models';

const calendarService = new CalendarService(db.Calendar, db.User);
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

      return res.status(200).send(userResponse.calendarSettings);
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

  updateSettings = async (req, res, next) => {
    try {
      const response = await this.userService.updateCalendarSettings(req.auth.user, req.body);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };

  delete = async (req, res, next) => {
    try {
      const userResponse = await this.userService.getOne(req.auth.user);

      const targetCalendarSettings = userResponse.calendarSettings.filter(
        (entry) => entry.id === req.params.calendarId
      );

      if (targetCalendarSettings.userDefault === true) {
        return res
          .status(403)
          .send({ message: 'Cannot delete default calendar. Please try again.', errorCode: 'calendar' });
      }

      const response = await this.service.delete(req.params.calendarId);

      return res.status(response.statusCode).send(response.data);
    } catch (e) {
      return next(e);
    }
  };
}

export default new CalendarController(calendarService, userService);
