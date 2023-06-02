import { combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userReducer";
import eventsReducer from "./eventsReducer";
import organizationsReducer from "./organizationsReducer";

const rootReducer = combineReducers({
    user: userReducer,
    events: eventsReducer,
    organizations: organizationsReducer,
    // other reducers: to be added here
});

export default rootReducer;