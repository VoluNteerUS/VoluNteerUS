export const setOrganizations = (organizations) => {
    return {
        type: "SET_ORGANIZATIONS",
        payload: organizations
    }
}

export const setCurrentOrganization = (organization) => {
    return {
        type: "SET_CURRENT_ORGANIZATION",
        payload: organization
    }
}

export const setCurrentOrganizationEvents = (events) => {
    return {
        type: "SET_CURRENT_ORGANIZATION_EVENTS",
        payload: events
    }
}