import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import customFieldApi from '../api/customFieldApi'

const initialState = {
  customFields: [],
  status: 'idle',
  error: null,
}

export const fetchCustomFields = createAsyncThunk(
  'customFields/fetchCustomFields',
  async () => {
    const response = await customFieldApi
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

export const addNewCustomField = createAsyncThunk(
  'customFields/addNewCustomField',
  async (initialCustomField) => {
    console.log('add new CustomField')
    console.log(initialCustomField)
    const response = await customFieldApi
      .create(initialCustomField)
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

export const updateCustomField = createAsyncThunk(
  'customFields/updateCustomField',
  async (initialCustomField) => {
    const { Id, Name, Field_Type, Description } = initialCustomField
    const response = await customFieldApi
      .update(Id, { Name, Field_Type, Description })
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

export const deleteCustomField = createAsyncThunk(
  'customFields/deleteCustomField',
  async (initialCustomField) => {
    const { Id } = initialCustomField
    const response = await customFieldApi
      .delete(Id)
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

const customFieldsSlice = createSlice({
  name: 'customFields',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchCustomFields.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchCustomFields.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      state.customFields = state.customFields.concat(action.payload.Data)
    },
    [fetchCustomFields.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [addNewCustomField.fulfilled]: (state, action) => {
      state.customFields.push(action.payload.Data)
    },
    [updateCustomField.fulfilled]: (state, action) => {
      const newCustomField = action.payload.Data
      const existingCustomField = state.customFields.find(
        (customField) => customField.Id == newCustomField.Id
      )
      if (existingCustomField) {
        existingCustomField.Name = newCustomField.Name
        existingCustomField.Field_Type = newCustomField.Field_Type
        existingCustomField.Description = newCustomField.Description
      }
    },
    [deleteCustomField.fulfilled]: (state, action) => {
      const returnedCustomField = action.payload.Data
      state.customFields = state.customFields.filter(
        (customField) => customField.Id != returnedCustomField.Id
      )
    },
  },
})

export default customFieldsSlice.reducer

export const selectAllCustomFields = (state) => state.customFields.customFields

export const selectCustomFieldById = (state, customFieldId) =>
  state.customFields.customFields.find(
    (customField) => customField.Id == customFieldId
  )
