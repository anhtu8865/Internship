import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import screenApi from '../api/screenApi'

const initialState = {
  screens: [],
  status: 'idle',
  error: null,
}

export const fetchScreens = createAsyncThunk(
  'screens/fetchScreens',
  async () => {
    const response = await screenApi
      .getAll()
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    return response
  }
)

export const addNewScreen = createAsyncThunk(
  'screens/addNewScreen',
  async (initialScreen) => {
    console.log('add new Screen')
    console.log(initialScreen)
    const response = await screenApi
      .create(initialScreen)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    //console.log(response.screen)
    return response
  }
)

export const updateScreen = createAsyncThunk(
  'screens/updateScreen',
  async (initialScreen) => {
    const { Id, Name, Description } = initialScreen
    const response = await screenApi
      .update(Id, { Name, Description })
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    //console.log(response.screen)
    return response
  }
)

export const deleteScreen = createAsyncThunk(
  'screens/deleteScreen',
  async (initialScreen) => {
    const { Id } = initialScreen
    //console.log(Id)
    const response = await screenApi
      .delete(Id)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        console.log(error)
      })
    //console.log(response.screen)
    return response
  }
)

const screensSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchScreens.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchScreens.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      // Add any fetched screens to the array
      state.screens = state.screens.concat(action.payload.Data)
      //   console.log("mới nè")
      //   console.log(state.screens)
    },
    [fetchScreens.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewScreen.fulfilled]: (state, action) => {
      state.screens.push(action.payload.Data)
    },
    [updateScreen.fulfilled]: (state, action) => {
      const newScreen = action.payload.Data
      console.log(newScreen)
      const existingScreen = state.screens.find(
        (screen) => screen.Id == newScreen.Id
      )
      if (existingScreen) {
        existingScreen.Name = newScreen.Name
        existingScreen.Description = newScreen.Description
      }
    },
    [deleteScreen.fulfilled]: (state, action) => {
      state.screens = [],
      state.status = 'idle'
    },
  },
})

export default screensSlice.reducer

export const selectAllScreens = (state) => state.screens.screens

export const selectScreenById = (state, screenId) =>
  state.screens.screens.find((screen) => screen.Id == screenId)
