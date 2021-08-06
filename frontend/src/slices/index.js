import {combineReducers} from '@reduxjs/toolkit';
import userReducer from './users';
import projectReducer from './projects';
import roleReducer from './roles'
const rootReducer = combineReducers({
    users: userReducer,
    projects: projectReducer,
    roles: roleReducer
});
export default rootReducer;