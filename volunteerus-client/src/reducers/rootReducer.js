import { combineReducers } from "@reduxjs/toolkit"
import userReducer from "./userReducer";

const rootReducer = combineReducers({
    user: userReducer,
    // other reducers: to be added here
});

export default rootReducer;