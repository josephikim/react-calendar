import HttpResponse from 'server/utils/httpResponse';

class RoleService {
  constructor(model) {
    this.model = model;
  }

  get = async (roles) => {
    // Mongoose returns [] for .find query with no matches
    const result = await this.model.find({ name: { $in: roles } });

    return new HttpResponse(result);
  };

  create = async (name) => {
    await this.model.create({ name }).then((role) => {
      console.log(`Created role: ${role.name}`);
    });
  };
}

export default RoleService;
