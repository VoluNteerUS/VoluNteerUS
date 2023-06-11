export const setEvent = (event) => {
    return {
        type: "FETCH_EVENT",
        payload: event
    }
}

export const setEvents = (event) => {
    return {
        type: "FETCH_EVENTS",
        payload: event
    }
}