import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import screenCustomFieldApi from '../api/screenCustomFieldApi'

const initialState = {
  screenCustomFields: [],
  status: 'idle',
  error: null,
}

export const fetchScreenCustomFields = createAsyncThunk(
  'screenCustomFields/fetchScreenCustomFields',
  async () => {
    const response = await screenCustomFieldApi
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

export const addNewScreenCustomField = createAsyncThunk(
  'screenCustomFields/addNewScreenCustomField',
  async (initialScreenCustomField, { rejectWithValue }) => {
    console.log('add new ScreenCustomField')
    console.log(initialScreenCustomField)
    const response = await screenCustomFieldApi
      .create(initialScreenCustomField)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

export const updateScreenCustomField = createAsyncThunk(
  'screenCustomFields/updateScreenCustomField',
  async (initialScreenCustomField, { rejectWithValue }) => {
    const { Id, ...fields } = initialScreenCustomField
    const response = await screenCustomFieldApi
      .update(Id, fields)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

export const deleteScreenCustomField = createAsyncThunk(
  'screenCustomFields/deleteScreenCustomField',
  async (initialScreenCustomField, { rejectWithValue }) => {
    const { Id } = initialScreenCustomField
    const response = await screenCustomFieldApi
      .delete(Id)
      .then(function (response) {
        console.log(response)
        return response
      })
      .catch(function (error) {
        throw rejectWithValue(error.response.data)
      })
    return response
  }
)

const screenCustomFieldsSlice = createSlice({
  name: 'screenCustomFields',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchScreenCustomFields.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchScreenCustomFields.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      state.screenCustomFields = state.screenCustomFields.concat(action.payload.Data)
    },
    [fetchScreenCustomFields.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewScreenCustomField.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [addNewScreenCustomField.fulfilled]: (state, action) => {
      state.screenCustomFields.push(action.payload.Data)
    },
    [updateScreenCustomField.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [updateScreenCustomField.fulfilled]: (state, action) => {
      const newScreenCustomField = action.payload.Data
      state.screenCustomFields = state.screenCustomFields.map((screenCustomField) =>
        screenCustomField.Id === newScreenCustomField.Id ? newScreenCustomField : screenCustomField
      )
    },
    [deleteScreenCustomField.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [deleteScreenCustomField.fulfilled]: (state, action) => {
      const returnedScreenCustomField = action.payload.Data
      state.screenCustomFields = state.screenCustomFields.filter(
        (screenCustomField) => screenCustomField?.Id !== returnedScreenCustomField.Id
      )
    },
  },
})

export default screenCustomFieldsSlice.reducer

export const selectAllScreenCustomFields = (state) => state.screenCustomFields.screenCustomFields

export const selectScreenCustomFieldById = (state, screenCustomFieldId) =>
  state.screenCustomFields.screenCustomFields.find(
    (screenCustomField) => screenCustomField.Id == screenCustomFieldId
  )
