export const setEvents = (events) => {
    return {
        type: "FETCH_EVENTS",
        payload: events
    }
}
export const setEvent = (event) => {
    return {
        type: "FETCH_EVENT",
        payload: event
    }
}