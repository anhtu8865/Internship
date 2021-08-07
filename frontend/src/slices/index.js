import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './users'
import projectReducer from './projects'
import screenReducer from './screens'

const rootReducer = combineReducers({
  users: userReducer,
  projects: projectReducer,
  screens: screenReducer,
})
export default rootReducer
