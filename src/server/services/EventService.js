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
  getAll = async (id) => {
    try {
      const calendars = await this.calendarService.getAll(id);

      const result = await this.model
        .find({
          calendarId: {
            $in: calendars
          }
        })
        .select('-__v')
        .sort({ start: -1 });

      return result;
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
