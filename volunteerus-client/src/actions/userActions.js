export const setUser = (user) => {
    return {
        type: "SET_USER",
        payload: user
    }
}

export const removeUser = () => {
    return {
        type: "REMOVE_USER"
    }
};

export const setUserOrganizations = (organizations) => {
    return {
        type: "SET_USER_ORGANIZATIONS",
        payload: organizations
    }
};

export const removeUserOrganizations = () => {
    return {
        type: "REMOVE_USER_ORGANIZATIONS",
    }
};
