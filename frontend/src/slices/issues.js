import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import issueApi from '../api/issueApi'

const initialState = {
  issues: [],
  projectIssueTypeScreens: [],
  status: 'idle',
  statusAddIssue: 'idle',
  error: null,
}

export const fetchIssues = createAsyncThunk(
  'issues/fetchIssues',
  async () => {
    const response = await issueApi
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

export const fetchProjectIssueTypeScreens = createAsyncThunk(
  'issues/fetchProjectIssueTypeScreens',
  async () => {
    const response = await issueApi
      .init()
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

export const addNewIssue = createAsyncThunk(
  'issues/addNewIssue',
  async (initialIssue, { rejectWithValue }) => {
    console.log('add new Issue')
    console.log(initialIssue)
    const response = await issueApi
      .create(initialIssue)
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

export const updateIssue = createAsyncThunk(
  'issues/updateIssue',
  async (initialIssue, { rejectWithValue }) => {
    const { Id, ...fields } = initialIssue
    const response = await issueApi
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

export const deleteIssue = createAsyncThunk(
  'issues/deleteIssue',
  async (initialIssue, { rejectWithValue }) => {
    const { Id } = initialIssue
    const response = await issueApi
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

const issuesSlice = createSlice({
  name: 'issues',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchIssues.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchIssues.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      state.issues = state.issues.concat(action.payload.Data)
    },
    [fetchIssues.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.payload.Msg
    },
    [fetchProjectIssueTypeScreens.pending]: (state) => {
      state.statusAddIssue = 'loading'
    },
    [fetchProjectIssueTypeScreens.fulfilled]: (state, action) => {
      state.statusAddIssue = 'succeeded'
      state.projectIssueTypeScreens = state.projectIssueTypeScreens.concat(action.payload.Data)
    },
    [fetchProjectIssueTypeScreens.rejected]: (state, action) => {
      state.statusAddIssue = 'failed'
      state.error = action.payload.Msg
    },
    [addNewIssue.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [addNewIssue.fulfilled]: (state, action) => {
      //state.issues.push(action.payload.Data)
      state.status = 'idle'
    },
    [updateIssue.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [updateIssue.fulfilled]: (state, action) => {
      const newIssue = action.payload.Data
      state.issues = state.issues.map((issue) =>
        issue.Id === newIssue.Id ? newIssue : issue
      )
    },
    [deleteIssue.rejected]: (state, action) => {
      console.log(action.payload.Msg)
    },
    [deleteIssue.fulfilled]: (state, action) => {
      const returnedIssue = action.payload.Data
      state.issues = state.issues.filter(
        (issue) => issue.Id !== returnedIssue.Id
      )
    },
  },
})

export default issuesSlice.reducer

export const selectAllIssues = (state) => state.issues.issues

export const selectAllProjectIssueTypeScreens = (state) => state.issues.projectIssueTypeScreens

export const selectIssueById = (state, issueId) =>
  state.issues.issues.find(
    (issue) => issue.Id == issueId
  )
