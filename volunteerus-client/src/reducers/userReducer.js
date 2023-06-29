const initialState = {
    user: null,
    organizations: []
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER":
            return { 
                ...state, 
                user: action.payload 
            };
        case "REMOVE_USER":
            return { 
                ...state, 
                user: null 
            };
        case "SET_USER_ORGANIZATIONS":
            return {
                ...state,
                organizations: action.payload
            }
        case "REMOVE_USER_ORGANIZATIONS":
        return {
            ...state,
            organizations: []
        }
        default:
            return state;
    }
}

export default userReducer;