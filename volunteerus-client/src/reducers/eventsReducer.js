const initialState = {
    event: {},
    events: [],
}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_EVENT':
            return {
                ...state,
                event: action.payload
            };
        case 'FETCH_EVENTS':
            return {
                ...state,
                events: action.payload
            };
        case 'ADD_EVENT':
            return {
                ...state,
                events: [...state.events, action.payload]
            };
        case 'EDIT_EVENT':
            return {
                ...state,
                events: state.events.map((event) => {
                    if (event._id === action.payload._id) {
                        return {
                            ...event,
                            ...action.payload
                        }
                    } else {
                        return event;
                    }
                })
            };
        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter((event) => event._id !== action.payload)
            };
        default:
            return state;
    }
}

export default eventsReducer;