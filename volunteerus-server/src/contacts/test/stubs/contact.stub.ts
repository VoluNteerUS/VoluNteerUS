import mongoose from "mongoose";
import { Contact } from "../../schemas/contact.schema";

export const contactStub = (): Contact => {
    return {
        email: "testorganization@nus.edu.sg",
        social_media: [],
    }
};

export const contactIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("5f9d88d3d13f8b0e3c5d7d1f");
};