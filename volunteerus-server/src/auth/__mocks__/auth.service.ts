import { userStub } from "../../users/test/stubs/user.stub";

export const AuthService = jest.fn(() => ({
    validateUser: jest.fn().mockResolvedValue(userStub()),
    login: jest.fn().mockResolvedValue({}),
    verify: jest.fn().mockResolvedValue({}),
    getProfile: jest.fn().mockResolvedValue(userStub()),
}));