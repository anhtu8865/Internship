import ProjectUserRoleApi from '../api/pro-user-roleApi'
import UserApi from '../api/userApi'

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
    addUserToProject: (state, action) => {
      state.projectUserRoles.unshift(action.payload)
    },
    removeUserProject: (state, action) => {
      let filteredUser = state.projectUserRoles.filter(
        (user) => user.UserId !== action.payload
      )
      state.projectUserRoles = filteredUser
    },
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
    // setUserProjectUpdate:(state,action)=>{
    //   state.projectUserRoles = action.payload
    // },
    // updateUserProject:(state,action)=>{
    //    const { id, data } = action.payload
    //    let newUsers = state.users.map((user) =>
    //      user.UserId === id ? { UserId: id, ...data } : user
    //    )
    //    state.users = newUsers
    // }
  },
})

const {
  addUserToProject,
  startLoading,
  getFailure,
  getProjectUserRoleSuccess,
  removeUserProject,
} = projectUserRolesSlice.actions

export const projectUserRolesSelector = (state) => state.projectUserRoles
export const projectUserRolesUpdateSelector = (state) =>
  state.projectUserRoleUpdate

const projectUserRoleReducer = projectUserRolesSlice.reducer
export default projectUserRoleReducer

export const fetchProjectUserRole = (key) => async (dispatch) => {
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
//add user role to project
export const AddUserToProject = (data) => async (dispatch) => {
  ProjectUserRoleApi.addUserRoleToProject(data)
    .then(async (res) => {
    console.log(res.Msg)
    if (res.Msg == "Add User Success") {
      await UserApi.infoUser(data.userId).then((user) => {
        console.log(user.Data)
        let newuser = {
          UserId: user.Data.User_Id,
          UserName: user.Data.Username,
          UserMail: user.Data.User_Email,
          RoleName: data.RoleName,
        }
        dispatch(addUserToProject(newuser))
      })
    }
      return res

    })
    .catch((error) => {
      dispatch(getFailure())
      return error
    })
}

//delete
export const deleteUser = (data) => async (dispatch) => {
  ProjectUserRoleApi.deleteUserProject(data)
    .then((res) => {
      dispatch(removeUserProject(data.UserId))
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
      dispatch(getFailure())
    })
}

//update 
// export const setUserUpdate = (User) => async (dispatch) => {
//   try {
//     dispatch(actions.setUserProjectUpdate(User))
//   } catch (error) {
//     dispatch(getFailure())
//   }
// }

// export const updateUser = (data) => async (dispatch) => {
//   ProjectUserRoleApi.updateRoleUserInProject(data)
//     .then((res) => {
//       dispatch(actions.updateUserProject(data))
//       return res
//     })
//     .catch((err) => {
//       dispatch(getFailure())
//       return err
//     })
// }
