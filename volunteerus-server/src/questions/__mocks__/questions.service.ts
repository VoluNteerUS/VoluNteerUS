import { questionStub, updatedQuestionStub } from "../test/stubs/question.stub";

export const QuestionsService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(questionStub()),
    findAll: jest.fn().mockResolvedValue([questionStub()]),
    findOne: jest.fn().mockResolvedValue(questionStub()),
    update: jest.fn().mockResolvedValue(updatedQuestionStub()),
    remove: jest.fn().mockResolvedValue(questionStub()),
});