import mongoose from 'mongoose';
import HttpResponse from 'server/utils/httpResponse';

class EventService {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    try {
      const result = await this.model.create(data);

      return result;
    } catch (e) {
      throw e;
    }
  };

  // get all user and system events
  getAll = async (calendarIdArray) => {
    const objectIds = calendarIdArray.map((calendarId) => {
      return mongoose.Types.ObjectId(calendarId);
    });

    try {
      const result = await this.model
        .find({
          calendarId: {
            $in: objectIds
          }
        })
        .sort({ start: -1 });

      return new HttpResponse(result);
    } catch (e) {
      throw e;
    }
  };

  update = async (id, data) => {
    try {
      const _obj = {
        ...data,
        start: new Date(data.start),
        end: new Date(data.end)
      };

      const result = await this.model.findByIdAndUpdate({ id }, _obj, { new: true });

      return result;
    } catch (e) {
      throw e;
    }
  };

  delete = async (id) => {
    try {
      const result = await this.model.findByIdAndDelete({ id });

      return result;
    } catch (e) {
      throw e;
    }
  };
}

export default EventService;
