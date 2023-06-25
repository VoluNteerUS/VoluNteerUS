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