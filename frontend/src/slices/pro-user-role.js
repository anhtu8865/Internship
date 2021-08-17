import ProjectUserRoleApi from '../api/pro-user-roleApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErroes: false,
  projectUserRoles: [],
  projectUserRoleUpdate: {},
}
const projectUserRolesSlice = createSlice({
  name: 'projectUserRoles',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true
    },
    getFailure: (state) => {
      state.loading = false
      state.hasErrors = true
    },
    getProjectUserRoleSuccess: (state, action) => {
      state.projectUserRoles = action.payload
      state.loading = false
      state.hasErrors = false
    },
  },
})

const { startLoading, getFailure, getProjectUserRoleSuccess } =
  projectUserRolesSlice.actions

export const projectUserRoleSelector = (state) => state.projectUserRoles

const projectUserRoleReducer = projectUserRolesSlice.reducer
export default projectUserRoleReducer

export const fetchProjectUserRole = (key) => async(dispatch) =>{
    dispatch(startLoading())
    ProjectUserRoleApi.getAllUserRoleInProject(key)
      .then((res) => {
        if (!res.Data) dispatch(getProjectUserRoleSuccess([]))
        if (res.Data) dispatch(getProjectUserRoleSuccess(res.Data))
      })
      .catch((err) => {
        dispatch(getFailure())
        return err
      })
}
