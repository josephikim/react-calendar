class RoleService {
  constructor(model) {
    this.model = model;
  }

  create = async (name) => {
    await this.model.create({ name }).then((e, role) => {
      if (e) {
        throw e;
      }
      console.log(`Created role: ${role.name}`);
    });
  };

  get = async (roles) => {
    const result = await this.model.find({ name: { $in: roles } });

    return result;
  };
}

export default RoleService;
