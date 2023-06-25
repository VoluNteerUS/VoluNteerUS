import mongoose from "mongoose";
import { Organization } from "src/organizations/schemas/organization.schema";

export const organizationStub = (): Organization => {
    return {
        name: "Test Organization",
        description: "Test Description",
        image_url: "Test Image URL",
        contact: {
            email: "Test Email",
            social_media: [],
        },
        committee_members: [],
    }
};

export const organizationIdStub = (): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId("5f9d88d3d13f8b0e3c5d7d1f");
};