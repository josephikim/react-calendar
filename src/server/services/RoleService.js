const initRoles = (Role) => () => {
  console.log('initRoles hit');
  Role.estimatedDocumentCount((err, count) => {
    console.log('count', count);
    if (!err && count === 0) {
      return Promise.all([addRole('user'), addRole('moderator'), addRole('admin')]);
    }
  });
};

const addRole = (Role) => (name) => {
  const _obj = new Role({ name: name });

  _obj.save().exec(function (err, role) {
    if (err) {
      throw err;
    }
    return console.log('added', role.name, 'to roles collection');
  });
};

const getRoles = (Role) => (roles) => {
  return Role.find({ name: { $in: roles } });
};

const assignRoles = (Role) => (user, rolesArr) => {
  const roles = Role.find({ name: { $in: rolesArr } }).exec();

  user.roles = roles.map((role) => role._id);

  return user.save();
};

const RoleService = (Role) => {
  return {
    initRoles: initRoles(Role),
    addRole: addRole(Role),
    getRoles: getRoles(Role),
    assignRoles: assignRoles(Role)
  };
};

export default RoleService;
