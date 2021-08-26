import { createSlice } from '@reduxjs/toolkit'
import workflowApi from '../api/workflowApi'


export const initialState = {
  loading: false,
  hasErrors: false,
  workflows: [],
  workflowUpdate: {},
}

//slice
const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    addWorkflow: (state, action) => {
      state.workflows.unshift(action.payload)
    },
    removeWorkflow: (state, action) => {
      let filteredWorkflow = state.workflows.filter(
        (workflow) => workflow.WorkflowId !== action.payload
      )
      state.workflows = filteredWorkflow
    },
    startLoading: (state) => {        
        state.loading = true
      },
    getWorkflowSuccess:(state, action) =>{
        state.workflows = action.payload
        state.loading = false
        state.hasErrors = false
    },
    getWorkflowFailure:(state)=>{
        state.loading = false
        state.hasErrors = true
    },
    setWorkflowUpdate:(state,action) =>{
      console.log(state)
      state.workflowUpdate = action.payload
    },
    updateWorkflow:(state,action) =>{
        const {id,data} = action.payload
        let newWorkflows = state.workflows.map(
            (
                workflow => (workflow.WorkflowId === id ? {WorkflowId: id, ...data} : workflow)
            ))
        state.workflows = newWorkflows

    }
  },
})

const {addWorkflow, getWorkflowSuccess,startLoading,getWorkflowFailure,removeWorkflow} =
workflowsSlice.actions

const {actions} = workflowsSlice

//export workflow
export const workflowsSelector = (state) => state.workflows
export const workflowsUpdateSelector = (state) => state.workflowUpdate

// export The reducer
const workflowReducer = workflowsSlice.reducer
export default workflowReducer
//Actions
export const fetchWorkflows = () => async(dispatch) =>{
    dispatch(startLoading())
    workflowApi
    .getAllWorkflow()
    .then((res)=>{
        if(res.Data) {
            dispatch(getWorkflowSuccess(res.Data))
        } else dispatch(getWorkflowSuccess([]))

    })
    .catch((err)=>{
      dispatch(getWorkflowFailure())
      return(err)
    })

}
//create workflow 
export const createWorkflow = (Workflow) => async(dispatch) =>{
    console.log(Workflow)
    workflowApi
    .createWorkflow(Workflow)
    .then((res)=>{
      dispatch(addWorkflow(Workflow))
      return res
    }).catch((err)=>{
      alert(err.response.data.Msg)
      dispatch(getWorkflowFailure())
    })
  
}
export const deleteWorkflow = (id) => async(dispatch) =>{
  workflowApi
  .delete(id)
  .then((res)=>{
    dispatch(removeWorkflow(id))
    console.log(res)
  })
  .catch((err)=>{
    dispatch(getWorkflowFailure())
    return(err)
  })
}

export const setWorkflowUpdate = (workflow) => async(dispatch) =>{
  try {
    console.log("=====")
    console.log(workflow)
    dispatch(actions.setWorkflowUpdate(workflow))
  } catch (error) {
    dispatch(getWorkflowFailure())

  }
}

export const updateWorkflow = (workflow) => async(dispatch) =>{
  workflowApi
  .updateWorkflow(workflow)
  .then((res)=>{
    dispatch(actions.updateWorkflow(workflow))
    return res
  })
  .catch((err)=>{
    dispatch(getWorkflowFailure())
    return err
  })
}
export const getDataByIdWorkflow = (id) => async(dispatch) =>{
  console.log(id)  
  workflowApi
    .getById(id)
    .then((res)=>{
      console.log(res)
      dispatch(getTransitionSuccess(res.Data))
      console.log(res)
    })
    .catch((err)=>{
      dispatch(getTransitionFailure())
      return(err)
    })
  }