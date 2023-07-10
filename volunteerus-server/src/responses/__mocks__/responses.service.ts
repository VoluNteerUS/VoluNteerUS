import { paginatedResponseStub, responseStub } from "../test/stubs/response.stub";

export const ResponsesService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(responseStub()),
    findAll: jest.fn().mockResolvedValue([responseStub()]),
    findOne: jest.fn().mockResolvedValue(responseStub()),
    findOneByUser: jest.fn().mockResolvedValue(responseStub()),
    getResponsesByUser: jest.fn().mockResolvedValue([responseStub()]),
    getAcceptedResponsesByUser: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getPendingResponsesByUser: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getRejectedResponsesByUser: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getResponsesByEvent: jest.fn().mockResolvedValue([responseStub()]),
    getAcceptedResponsesByEvent: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getPendingResponsesByEvent: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getRejectedResponsesByEvent: jest.fn().mockResolvedValue(paginatedResponseStub()),
    getTotalHours: jest.fn().mockResolvedValue(responseStub().hours),
    getPastAcceptedResponsesByUser: jest.fn().mockResolvedValue(paginatedResponseStub()),
    update: jest.fn().mockResolvedValue({ ...responseStub(), status: "Approved", attendance: "Present" }),
    remove: jest.fn().mockResolvedValue(responseStub()),
});
