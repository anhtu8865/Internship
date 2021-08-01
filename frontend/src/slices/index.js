import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './users';
import projectReducer from './projects';
const rootReducer = combineReducers({
    users: userReducer,
    projects: projectReducer
});
export default rootReducer;