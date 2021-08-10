import permissionApi from '../api/permissionApi'
import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  hasErrors: false,
  permissions: [],
  permissionUpdate: {},
}
//A slice
const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true
    },
    getPermissionsSuccess: (state, action) => {
      state.permissions = action.payload
      state.loading = false
      state.hasErrors = false
    },
 
    getPermissionsFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
  },
})

const { startLoading, getPermissionsSuccess, getPermissionsFailure } =
  permissionsSlice.actions

export const permissionsSelector = (state) => state.permissions

// export const permissionUpdateSelector = (state) => state.permissionUpdate

const permissionsReducer = permissionsSlice.reducer
export default permissionsReducer

//actions
export const fetchPermissions = () => async (dispatch) => {
  dispatch(startLoading())
  permissionApi
    .getAllPermission()
    .then((res) => {
      if (res.Data) dispatch(getPermissionsSuccess(res.Data))
    })
    .catch((err) => {
      dispatch(getPermissionsFailure())
      return err
    })
}


