import { Event } from "../../schemas/event.schema"
import { organizationStub } from "../../../organizations/test/stubs/organization.stub"
import { questionStub } from "../../../questions/test/stubs/question.stub"
import mongoose from "mongoose";

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
    }
};

export const eventIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("645fac0625f4bbf51f8f42e1");
}