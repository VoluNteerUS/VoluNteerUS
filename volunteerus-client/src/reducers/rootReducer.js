import { combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userReducer";
import eventsReducer from "./eventsReducer";
import organizationsReducer from "./organizationsReducer";
import questionsReducer from "./questionsReducer";

const rootReducer = combineReducers({
    user: userReducer,
    events: eventsReducer,
    organizations: organizationsReducer,
    questions: questionsReducer,
    // other reducers: to be added here
});

export default rootReducer;