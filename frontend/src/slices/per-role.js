import permissionApi from '../api/permissionApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  permissionroles: [],
  permissionUpdate: {},
}
const permissionRolesSlice = createSlice({
  name: 'permissionroles',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true
    },
    getPermissionsRolesSuccess: (state, action) => {
      state.permissionsroles = action.payload
      state.loading = false
      state.hasErrors = false
    },
    getPermissionRolesFailure: (state) => {
        state.loading = false
        //handling Errors
        state.hasErrors = true
    },
  },
})

const {startLoading,getPermissionsRolesSuccess,getPermissionRolesFailure} =
permissionRolesSlice.actions
export const permissionRolesSelector = (state) => state.permissionroles

const permissionRolesReducer = permissionRolesSlice.reducer
export default permissionRolesReducer
//
export const fetchPermissionRoles = () =>async(dispatch) =>{
    dispatch(startLoading())
    permissionApi
      .getPrmissionRole("1")
      .then((res)=>{
        if (res.Data) dispatch(getPermissionsRolesSuccess(res.Data))
    })
    .catch((err)=>{
        dispatch(getPermissionRolesFailure())
        return err
    })
}