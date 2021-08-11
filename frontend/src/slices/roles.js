import { createSlice } from '@reduxjs/toolkit'
import roleApi from '../api/roleApi'


export const initialState = {
  loading: false,
  hasErrors: false,
  roles: [],
  roleUpdate: {},
}

//slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action) => {
      state.roles.unshift(action.payload)
    },
    removeRole: (state, action) => {
      let filteredRole = state.roles.filter(
        (role) => role.Role_Id !== action.payload
      )
      state.roles = filteredRole
    },
    startLoading: (state) => {        
        state.loading = true
      },
    getRoleSuccess:(state, action) =>{
        state.roles = action.payload
        state.loading = false
        state.hasErrors = false
    },
    getRoleFailure:(state)=>{
        state.loading = false
        state.hasErrors = true
    },
    setRoleUpdate:(state,action) =>{
      state.roleUpdate = action.payload
    },
    updateRole:(state,action) =>{
        const {id,data} = action.payload
        let newRoles = state.roles.map(
            (
                role => (role.Role_Id === id ? {Role_Id: id, ...data} : role)
            ))
        state.roles = newRoles

    }
  },
})

const {addRole, getRoleSuccess,startLoading,getRoleFailure,removeRole} =
rolesSlice.actions

const {actions} = rolesSlice

//export role
export const rolesSelector = (state) => state.roles
export const rolesUpdateSelector = (state) => state.roleUpdate

// export The reducer
const roleReducer = rolesSlice.reducer
export default roleReducer
//Actions
export const fetchRoles = () => async(dispatch) =>{
    dispatch(startLoading())
    roleApi
    .getAllRole()
    .then((res)=>{
        if(res.Data) {
            dispatch(getRoleSuccess(res.Data))
        }
        return(res)

    })
    .catch((err)=>{
      dispatch(getRoleFailure())
      return(err)
    })

}
//create role 
export const createRole = (Role) => async(dispatch) =>{
    console.log(Role)
    roleApi
    .createRole(Role)
    .then((res)=>{
      dispatch(addRole(Role))
      return res
    }).catch((err)=>{
      alert(err.response.data.Msg)
      dispatch(getRoleFailure())
    })
  
}
export const deleteRole = (id) => async(dispatch) =>{
  roleApi
  .delete(id)
  .then((res)=>{
    dispatch(removeRole(id))
    console.log(res)
  })
  .catch((err)=>{
    dispatch(getRoleFailure())
    return(err)
  })
}

export const setRoleUpdate = (role) => async(dispatch) =>{
  try {
        dispatch(actions.setRoleUpdate(role))
  } catch (error) {
    dispatch(getRoleFailure())

  }
}

export const updateRole = (role) => async(dispatch) =>{
  roleApi
  .updateRole(role)
  .then((res)=>{
    dispatch(actions.updateRole(role))
    return res
  })
  .catch((err)=>{
    dispatch(getRoleFailure())
    return err
  })
}