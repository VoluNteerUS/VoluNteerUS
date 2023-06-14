const initialState = {
    responses: []
}

const responsesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_RESPONSES':
            return {
                ...state,
                responses: action.payload
            };
        default:
            return state;
    }
}

export default responsesReducer;