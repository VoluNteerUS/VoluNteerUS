import { eventStub } from "../test/stubs/event.stub";

export const EventsService = jest.fn(() => ({
    create: jest.fn().mockResolvedValue(eventStub()),
}));