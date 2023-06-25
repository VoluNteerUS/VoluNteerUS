import { urlStub } from "../test/stubs/url.stub";

export const FirebasestorageService = jest.fn(() => ({
    uploadFile: jest.fn().mockResolvedValue(urlStub()),
}));