import roleService from './roleService';

describe('role service tests', () => {
  it('has a module', () => {
    expect(roleService).toBeDefined()
  }),
    describe('addRole test', () => {
      it('adds a role', () => {
        const save = jest.fn();
        let roleName

        const MockModel = data => {
          roleName = data.name
          return {
            ...data,
            save
          }
        }

        const RoleService = roleService(MockModel)

        RoleService.addRole('test role')

        expect(save).toHaveBeenCalled();
        expect(roleName).toEqual('test role')
      })
    })
});
