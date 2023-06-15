import { combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userReducer";
import eventsReducer from "./eventsReducer";
import organizationsReducer from "./organizationsReducer";
import questionsReducer from "./questionsReducer";
import adminDashboardReducer from "./adminDashboardReducer";

const rootReducer = combineReducers({
    user: userReducer,
    events: eventsReducer,
    organizations: organizationsReducer,
    questions: questionsReducer,
    adminDashboard: adminDashboardReducer,
    // other reducers: to be added here
});

export default rootReducer;