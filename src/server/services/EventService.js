import HttpResponse from 'server/utils/httpResponse';

class EventService {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    try {
      const result = await this.model.create(data);

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  getUserEvents = async (calendarIds) => {
    try {
      // Mongoose returns [] for .find query with no matches
      const events = await this.model.find({ calendar: { $in: calendarIds } });

      return new HttpResponse(events);
    } catch (e) {
      throw e;
    }
  };

  update = async (data) => {
    try {
      const update = {
        ...data
      };

      delete update.id;

      // Mongoose returns the modified document (or null) for .findByIdAndUpdate query with option 'new: true'
      const result = await this.model.findByIdAndUpdate(data.id, update, { new: true });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  delete = async (id) => {
    try {
      // Mongoose returns the matching document (or null) for .findByIdAndDelete query
      const result = await this.model.findByIdAndDelete(id);

      if (!result) {
        const error = new Error('Event not found');

        error.statusCode = 404;
        throw error;
      } else {
        return new HttpResponse(result, { deleted: true });
      }
    } catch (e) {
      throw e;
    }
  };
}

export default EventService;
