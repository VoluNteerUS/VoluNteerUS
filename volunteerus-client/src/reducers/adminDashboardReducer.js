const initialState = {
    organizationCount: 0,
    eventCount: 0,
    userCount: 0,
    committeeMemberCount: 0,
    recentlyCreatedEvents: [],
    chartData: [],
}

const adminDashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ORGANIZATION_COUNT':
            return {
                ...state,
                organizationCount: action.payload
            };
        case 'SET_EVENT_COUNT':
            return {
                ...state,
                eventCount: action.payload
            };
        case 'SET_USER_COUNT':
            return {
                ...state,
                userCount: action.payload
            };
        case 'SET_COMMITTEE_MEMBER_COUNT':
            return {
                ...state,
                committeeMemberCount: action.payload
            };
        case 'SET_RECENTLY_CREATED_EVENTS':
            return {
                ...state,
                recentlyCreatedEvents: action.payload
            };
        case 'SET_CHART_DATA':
            return {
                ...state,
                chartData: action.payload
            };
        default:
            return state;
    }
}

export default adminDashboardReducer;