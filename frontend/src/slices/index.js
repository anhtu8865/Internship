
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './users'
import projectReducer from './projects'
import screenReducer from './screens'
import customFieldReducer from './customFields'
import roleReducer from './roles'
import workflowReducer from './workflows'
import transitionReducer from './transition'
import workflowProjectsReducer from './wor-pro'

import statusReducer from './statuss'
import transitionStatussReducer from './tra-sta'
const rootReducer = combineReducers({
  users: userReducer,
  projects: projectReducer,
  screens: screenReducer,
  customFields: customFieldReducer,
  roles: roleReducer,

  workflows: workflowReducer,
  transitions: transitionReducer,
  workflowprojects: workflowProjectsReducer,
  
  statuss: statusReducer,
  transitionstatuss: transitionStatussReducer,
})
export default rootReducer

