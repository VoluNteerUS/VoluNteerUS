import { eventStub, paginatedEventStub, stringifyEventDate, stringifySignupByDate, updatedEventStub } from "../test/stubs/event.stub";

export const EventsService = jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(eventStub()),
    findAll: jest.fn().mockResolvedValue(paginatedEventStub()),
    findLatestEvents: jest.fn().mockResolvedValue([eventStub()]),
    findUpcomingEvents: jest.fn().mockResolvedValue(paginatedEventStub()),
    findPastEvents: jest.fn().mockResolvedValue(paginatedEventStub()),
    getEventSignUpCount: jest.fn().mockResolvedValue(0),
    create: jest.fn().mockResolvedValue(eventStub()),
    update: jest.fn().mockResolvedValue(updatedEventStub()),
    getCategories: jest.fn().mockResolvedValue(eventStub().category),
    getEventsByOrganization: jest.fn().mockResolvedValue(paginatedEventStub()),
    getUpcomingEventsByOrganization: jest.fn().mockResolvedValue(paginatedEventStub()),
    getPastEventsByOrganization: jest.fn().mockResolvedValue(paginatedEventStub()),
    updateQuestions: jest.fn().mockResolvedValue(updatedEventStub()),
    remove: jest.fn().mockResolvedValue(eventStub()),
})

