import { Organization } from "../../schemas/organization.schema";
import { PaginationResult } from "../../../types/pagination";
import mongoose from "mongoose";

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

export const paginatedOrganizationStub = (): PaginationResult<Organization> => {
    return new PaginationResult<Organization>([organizationStub()], 1, 1, 1);
};