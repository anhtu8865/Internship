import { createSlice } from '@reduxjs/toolkit'
import projectApi from '../api/projectApi'

export const initialState = {
  loading: false,
  hasErrors: false,
  projects: [],
  projectUpdate: {}
}
// A slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.unshift(action.payload)
    },
    removeProject: (state,  action) => {
      console.log('remove', action)
      let filteredProject = state.projects.filter((project) => project.ProjectKey !== action.payload)
      state.projects = filteredProject
    },
    startLoading: (state) => {
      state.loading = true
    },
    getProjectsSuccess: (state, action) => {
      state.projects = action.payload
      console.log(state.projects.length);
      state.loading = false
      state.hasErrors = false
    },
    getProjectsFailure: (state) => {
      state.loading = false
      //handling Errors
      state.hasErrors = true
    },
    setProjectUpdate: (state, action) => {
      state.projectUpdate = action.payload
    },
    updateProject: (state, action) => {
      const { key, data } = action.payload
      console.log(data);
      let newProjects = state.projects.map(project => (project.ProjectKey === key ? {ProjectKey: key, ...data} : project))
      console.log(newProjects);
      state.projects = newProjects

    }
  },
})

// Actions generated from the slice
const { removeProject, startLoading, getProjectsFailure, getProjectsSuccess } =
  projectsSlice.actions

const { actions } = projectsSlice

// export project selector to get the slice in any component
export const projectsSelector = (state) => state.projects
export const projectUpdateSelector = (state) => state.projectUpdate
// export The reducer
const projectReducer = projectsSlice.reducer
export default projectReducer
// Actions
export const fetchProjects = () => async (dispatch) => {
  dispatch(startLoading())
  projectApi
    .getAll()
    .then((res) => {
      console.log(res)
      if (res.Data) dispatch(getProjectsSuccess(res.Data))
    })
    .catch((err) => {
      console.log(err)
      dispatch(getProjectsFailure())
    })
}

export const createProject = (project) => async (dispatch) => {
  
  projectApi
  .create(project)
  .then((res) => {
    console.log(res)
    dispatch(actions.addProject(project))
    
  })
  .catch((err) => {
    alert(err.response.data.Msg)
         //NEW
  })
}

export const deleteProject = (key) => async (dispatch) => {
  projectApi
  .delete(key)
  .then((res) => {
    console.log(res)
    dispatch(removeProject(key))
  })
  .catch((err) => {
    console.log(err)
    alert(err.response.data.Msg)
            //NEW
  })
}

export const setProjectUpdate = (Project) => async (dispatch) => {
  try {
    dispatch(actions.setProjectUpdate(Project))
  } catch (error) {
    dispatch(getProjectsFailure())
  }
}

export const updateProject = (data) => async (dispatch) => {
  projectApi
  .update(data)
  .then((res) => {
    console.log(res)
    dispatch(actions.updateProject(data))
  })
  .catch((err) => {
    console.log(err)
    alert(err.response.data.Msg)
      
  
  })
}

export const selectAllProjects = (state) => state.projects.projects