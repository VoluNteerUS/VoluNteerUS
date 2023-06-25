import { organizationStub, paginatedOrganizationStub } from "../test/stubs/organization.stub";

export const OrganizationsService = jest.fn(() => ({
    create: jest.fn().mockResolvedValue(organizationStub()),
    checkCommitteeMember: jest.fn().mockResolvedValue(true),
    addContactToOrganization: jest.fn().mockResolvedValue(organizationStub()),
    addCommitteeMembersToOrganization: jest.fn().mockResolvedValue(organizationStub()),
    count: jest.fn().mockResolvedValue(1),
    findAll: jest.fn().mockResolvedValue(paginatedOrganizationStub()),
    findOne: jest.fn().mockResolvedValue(organizationStub()),
    update: jest.fn().mockResolvedValue(organizationStub()),
    updateContact: jest.fn().mockResolvedValue(organizationStub()),
    updateCommitteeMembers: jest.fn().mockResolvedValue(organizationStub()),
    remove: jest.fn().mockResolvedValue(organizationStub()),
}));