
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './users'
import projectReducer from './projects'
import screenReducer from './screens'
import customFieldReducer from './customFields'
import screenCustomFieldReducer from './screenCustomFields'
import projectIssueTypeScreenReducer from './projectIssueTypeScreens'
import issueTypeReducer from './issueTypes'
import roleReducer from './roles'

const rootReducer = combineReducers({
  users: userReducer,
  projects: projectReducer,
  screens: screenReducer,
  customFields: customFieldReducer,
  screenCustomFields: screenCustomFieldReducer,
  projectIssueTypeScreens: projectIssueTypeScreenReducer,
  issueTypes: issueTypeReducer,
  roles: roleReducer,
})
export default rootReducer

