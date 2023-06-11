const initialState = {
    question: null,
    questions: []
}

const questionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_QUESTION':
            return {
                ...state,
                question: action.payload
            };
        case 'FETCH_QUESTIONS':
            return {
                ...state,
                questions: action.payload
            };
        default:
            return state;
    }
}

export default questionsReducer;