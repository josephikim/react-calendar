const addRole = (Role) => (name) => {
  const _obj = new Role({ name });

  return _obj.save();
};

const getRoles = (Role) => (roles) => {
  return Role.find({ name: { $in: roles } });
};

const assignRoles = (Role) => (user, rolesArr) => {
  const roles = Role.find({ name: { $in: rolesArr } }).exec();

  user.roles = roles.map((role) => role._id);

  return user.save();
};

const roleService = (Role) => {
  return {
    addRole: addRole(Role),
    getRoles: getRoles(Role),
    assignRoles: assignRoles(Role)
  };
};

export default roleService;
