import { organizationStub } from "../../organizations/test/stubs/organization.stub";
import { userStub } from "../test/stubs/user.stub";

export const UsersService = jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(userStub()),
    findAll: jest.fn().mockResolvedValue([userStub()]),
    create: jest.fn().mockResolvedValue(userStub()),
    update: jest.fn().mockResolvedValue({ ...userStub(), year_of_study: 2 }),
    getCommitteeMemberCount: jest.fn().mockResolvedValue(0),
    count: jest.fn().mockResolvedValue(1),
    findOneByEmail: jest.fn().mockResolvedValue(userStub()),
    findUsers: jest.fn().mockResolvedValue([userStub()]),
    findUserOrganizations: jest.fn().mockResolvedValue([organizationStub()]),
    delete: jest.fn().mockResolvedValue(userStub()),
})
