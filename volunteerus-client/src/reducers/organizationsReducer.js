const initialState = {
    organizations: [],
    currentOrganization: null,
    currentOrganizationEvents: [],
    currentOrganizationUpcomingEvents: [],
    currentOrganizationPastEvents: []
}

const organizationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ORGANIZATIONS':
            return {
                ...state,
                organizations: action.payload
            }
        case 'SET_CURRENT_ORGANIZATION':
            return {
                ...state,
                currentOrganization: action.payload
            }
        case 'SET_CURRENT_ORGANIZATION_EVENTS':
            return {
                ...state,
                currentOrganizationEvents: action.payload
            }
        default:
            return state;
    }
}

export default organizationsReducer;