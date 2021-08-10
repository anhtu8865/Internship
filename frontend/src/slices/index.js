
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './users'
import projectReducer from './projects'
import screenReducer from './screens'
import customFieldReducer from './customFields'
import roleReducer from './roles'
import permissionsReducer from './permission'
import permissionRolesReducer from './per-role'
const rootReducer = combineReducers({
  users: userReducer,
  projects: projectReducer,
  screens: screenReducer,
  customFields: customFieldReducer,
  roles: roleReducer,
  permissions: permissionsReducer,
  permissionroles:permissionRolesReducer,
  
})
export default rootReducer

