import { Event } from "../../schemas/event.schema"
import { organizationStub } from "../../../organizations/test/stubs/organization.stub"
import { questionStub, updatedQuestionStub } from "../../../questions/test/stubs/question.stub"
import mongoose from "mongoose";
import { PaginationResult } from "../../../types/pagination";

export const eventStub = (): Event => {
    return {
        title: "Food from the Heart",
        date: [new Date("2023-07-07T10:00:00.000+08:00"), new Date("2023-07-07T12:00:00.000+08:00")],
        location: "130 Joo Seng Rd, #03-01, Singapore 368357",
        organized_by: organizationStub(),
        category: ["Regular Volunteering Project"],
        signup_by: new Date("2023-07-04T00:00:00.000+08:00"),
        description: "Our food distribution programmes are run with sustainable charity in mind.",
        image_url: "Test Image URL",
        questions: questionStub(),
        groupSettings: ["No", "-", "1"],
        groups: [],
        defaultHours: [2],
        reminderSent: false
    }
};

export const eventIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1");
}

export const paginatedEventStub = (): PaginationResult<Event> => {
    return new PaginationResult<Event>([eventStub()], 1, 1, 1);
};

export const updatedEventStub = (): Event => {
    return { ...eventStub(), questions: updatedQuestionStub() }
};

export const stringifyEventDate = (): String[] => {
    return [eventStub().date[0].toISOString(), eventStub().date[1].toISOString()]
}

export const stringifySignupByDate = (): String => {
    return eventStub().signup_by.toISOString()
}
