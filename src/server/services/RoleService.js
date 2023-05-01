class RoleService {
  constructor(model) {
    this.model = model;
  }

  create = async (name) => {
    await this.model.create({ name }).then((role) => {
      console.log(`Created role: ${role.name}`);
    });
  };

  get = async (roles) => {
    const result = await this.model.find({ name: { $in: roles } });

    return result;
  };
}

export default RoleService;
