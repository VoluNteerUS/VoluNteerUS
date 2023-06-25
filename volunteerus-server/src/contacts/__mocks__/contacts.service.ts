import { contactStub } from "../test/stubs/contact.stub";

export const ContactsService = jest.fn(() => ({
    create: jest.fn().mockResolvedValue(contactStub()),
    findAll: jest.fn().mockResolvedValue([contactStub()]),
    findOne: jest.fn().mockResolvedValue(contactStub()),
    update: jest.fn().mockResolvedValue(contactStub()),
    remove: jest.fn().mockResolvedValue(contactStub()),
}));