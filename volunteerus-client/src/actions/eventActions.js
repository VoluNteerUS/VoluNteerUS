export const setEvents = (events) => {
    return {
        type: "FETCH_EVENTS",
        payload: events
    }
}