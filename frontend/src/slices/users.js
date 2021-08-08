import { createSlice } from '@reduxjs/toolkit'
import userApi from '../api/userApi'

export const initialState = {
  loading: false,
  hasErrors: false,
  users: [],
  userUpdate: {}
}
// A slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.unshift(action.payload)
    },
    removeUser: (state,  action) => {
      console.log('remove', action)
      let filteredUser = state.users.filter((user) => user.User_Id !== action.payload)
      state.users = filteredUser
    },
    startLoading: (state) => {
      state.loading = true
    },
    getUsersSuccess: (state, action) => {
      state.users = action.payload
      console.log(state.users.length);
      state.loading = false
      state.hasErrors = false
    },
    getUsersFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    setUserUpdate: (state, action) => {
      state.userUpdate = action.payload
    },
    updateUser: (state, action) => {
      const { id, data } = action.payload
      console.log(data);
      let newUsers = state.users.map(user => (user.User_Id === id ? {User_Id: id, ...data} : user))
      console.log(newUsers);
      state.users = newUsers
    }
  },
})

// Actions generated from the slice
const { addUser, removeUser, startLoading, getUsersFailure, getUsersSuccess } =
  usersSlice.actions

const { actions } = usersSlice

// export user selector to get the slice in any component
export const usersSelector = (state) => state.users
export const userUpdateSelector = (state) => state.userUpdate
// export The reducer
const userReducer = usersSlice.reducer
export default userReducer
// Actions
export const fetchUsers = () => async (dispatch) => {
  dispatch(startLoading())
  userApi
    .getAll()
    .then((res) => {
      console.log(res)
      if (res.Data) dispatch(getUsersSuccess(res.Data))
    })
    .catch((err) => {
      console.log(err)
      dispatch(getUsersFailure())
    })
}

export const createUser = (User) => async (dispatch) => {
  try {
    dispatch(addUser(User))
  } catch (error) {
    dispatch(getUsersFailure())
  }
}

export const deleteUser = (id) => async (dispatch) => {
  userApi
  .delete(id)
  .then((res) => {
    console.log(res)
    dispatch(removeUser(id))
  })
  .catch((err) => {
    console.log(err)
    dispatch(getUsersFailure())
  })
}

export const setUserUpdate = (User) => async (dispatch) => {
  try {
    dispatch(actions.setUserUpdate(User))
  } catch (error) {
    dispatch(getUsersFailure())
  }
}

export const updateUser = (data) => async (dispatch) => {
  userApi
  .update(data)
  .then((res) => {
    console.log(res)
    dispatch(actions.updateUser(data))
  })
  .catch((err) => {
    console.log(err)
    dispatch(getUsersFailure())
  })
}