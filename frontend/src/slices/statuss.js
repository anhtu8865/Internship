import { createSlice } from '@reduxjs/toolkit'
import statusApi from '../api/statusApi'


export const initialState = {
  loading: false,
  hasErrors: false,
  statuss: [],
  statusUpdate: {},
}

//slice
const statussSlice = createSlice({
  name: 'statuss',
  initialState,
  reducers: {
    addStatus: (state, action) => {
      state.statuss.unshift(action.payload)
    },
    removeStatus: (state, action) => {
      let filteredStatus = state.statuss.filter(
        (status) => status.StatusId !== action.payload
      )
      state.statuss = filteredStatus
    },
    startLoading: (state) => {        
        state.loading = true
      },
    getStatusSuccess:(state, action) =>{
        state.statuss = action.payload
        state.loading = false
        state.hasErrors = false
    },
    getStatusFailure:(state)=>{
        state.loading = false
        state.hasErrors = true
    },
    setStatusUpdate:(state,action) =>{
      console.log(state)
      state.statusUpdate = action.payload
    },
    updateStatus:(state,action) =>{
        const {id,data} = action.payload
        let newStatuss = state.statuss.map(
            (
                status => (status.StatusId === id ? {StatusId: id, ...data} : status)
            ))
        state.statuss = newStatuss

    }
  },
})

const {addStatus, getStatusSuccess,startLoading,getStatusFailure,removeStatus} =
statussSlice.actions

const {actions} = statussSlice

//export status
export const statussSelector = (state) => state.statuss
export const statussUpdateSelector = (state) => state.statusUpdate

// export The reducer
const statusReducer = statussSlice.reducer
export default statusReducer
//Actions
export const fetchStatuss = () => async(dispatch) =>{
    dispatch(startLoading())
    statusApi
    .getAllStatus()
    .then((res)=>{
        if(res.Data) {
            dispatch(getStatusSuccess(res.Data))
        }
        return(res)

    })
    .catch((err)=>{
      dispatch(getStatusFailure())
      return(err)
    })

}
//create status 
export const createStatus = (Status) => async(dispatch) =>{
    console.log(Status)
    statusApi
    .createStatus(Status)
    .then((res)=>{
      dispatch(addStatus(Status))
      return res
    }).catch((err)=>{
      alert(err.response.data.Msg)
      dispatch(getStatusFailure())
    })
  
}
export const deleteStatus = (id) => async(dispatch) =>{
  statusApi
  .delete(id)
  .then((res)=>{
    dispatch(removeStatus(id))
    console.log(res)
  })
  .catch((err)=>{
    dispatch(getStatusFailure())
    return(err)
  })
}

export const setStatusUpdate = (status) => async(dispatch) =>{
  try {
    console.log("=====")
    console.log(status)
    dispatch(actions.setStatusUpdate(status))
  } catch (error) {
    dispatch(getStatusFailure())

  }
}

export const updateStatus = (status) => async(dispatch) =>{
  statusApi
  .updateStatus(status)
  .then((res)=>{
    dispatch(actions.updateStatus(status))
    return res
  })
  .catch((err)=>{
    dispatch(getStatusFailure())
    return err
  })
}