import { PaginationResult } from "../../../types/pagination";
import { eventStub } from "../../../events/test/stubs/event.stub";
import { Response } from "../../../responses/schemas/response.schema";
import { userStub } from "../../../users/test/stubs/user.stub";
import mongoose from "mongoose";

export const responseStub = (): Response => {
    return {
        event: eventStub(),
        user: userStub(),
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        selected_users: [],
        status: "Pending",
        submitted_on: new Date("2023-06-24T12:38:00.000+08:00"),
        attendance: [],
        hours: [-1],
        shifts: []
    }
};

export const responseIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("5f9d88e5d6a3d5fda0f8a5f2");
};

export const userIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("5f9d88e5d6a3d5fda0f8a5f3");
};

export const paginatedResponseStub = (): PaginationResult<Response> => {
    return new PaginationResult<Response>([responseStub()], 1, 1, 1);
};

export const updatedResponseStub = (): Response => {
    return {
        event: eventStub(),
        user: userStub(),
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        selected_users: [],
        status: "Accepted",
        submitted_on: new Date("2023-06-24T12:38:00.000+08:00"),
        attendance: [],
        hours: [-1],
        shifts: []
    }
}
