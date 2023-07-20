export const setEventCount = (eventCount) => {
    return {
        type: "SET_EVENT_COUNT",
        payload: eventCount
    }
}

export const setOrganizationCount = (organizationCount) => {
    return {
        type: "SET_ORGANIZATION_COUNT",
        payload: organizationCount
    }
}

export const setUserCount = (userCount) => {
    return {
        type: "SET_USER_COUNT",
        payload: userCount
    }
}

export const setCommitteeMemberCount = (committeeMemberCount) => {
    return {
        type: "SET_COMMITTEE_MEMBER_COUNT",
        payload: committeeMemberCount
    }
}

export const setRecentlyCreatedEvents = (recentlyCreatedEvents) => {
    return {
        type: "SET_RECENTLY_CREATED_EVENTS",
        payload: recentlyCreatedEvents
    }
}

export const setChartData = (chartData) => {
    return {
        type: "SET_CHART_DATA",
        payload: chartData
    }
}
