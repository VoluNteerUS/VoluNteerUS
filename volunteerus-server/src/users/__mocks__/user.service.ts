import { userStub } from "../test/stubs/user.stub";

export const UsersService = jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(userStub()),
    findAll: jest.fn().mockResolvedValue([userStub()]),
    createUser: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue(userStub()),
});