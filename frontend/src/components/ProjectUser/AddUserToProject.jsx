import React, { useEffect, useState } from 'react'
import DialogModal from '../DialogModal'
import { DialogActions, DialogContent } from '../DialogModal'
import Button from '@material-ui/core/Button'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store'
import { AddUserToProject } from '../../slices/pro-user-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { fetchUsers, usersSelector } from '../../slices/users'
import { useSelector } from 'react-redux'
import FormInput from '../Form/FormInput'
import Select from 'react-select'

export default function AddUserProject({ modalDialog }) {
  const { handleClose, projectkey, listUser } = modalDialog
  const { register, handleSubmit } = useForm()
  const dispatch = useAppDispatch()
  //load user
  const { users } = useSelector(usersSelector)
  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])
   const temp = users.filter(
     (item1) => !listUser.some((item2) => item1.User_Id === item2.UserId)
   )
 
  const options_user = temp.map((user) => ({
    value: user.User_Id,
    label: user.User_Name,
  }))

  //load role
  const { roles } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  var options = roles.map((option) => {
    return (
      <option key={option.Role_Id} value={option.Role_Id}>
        {option.Role_Name}
      </option>
    )
  })
 const [arrUser, setarrUser] = useState([])
  const onchangeSelect = (item) => {
    setarrUser(item)
  }
  //submit
  const onSubmit = (data) => {
    let role_name
    roles.map((temp) => {
      if (temp.Role_Id == data.idrole) {
        role_name = temp.Role_Name
      }
    })
    arrUser.map((user)=>{
      const postdata = {
        userId: user.value.toString(),
        roleId: data.idrole,
        projectKey: projectkey,
        RoleName: role_name,
      }
      dispatch(AddUserToProject(postdata))
    })
    handleClose()
  }
  return (
    <>
    
      <DialogModal
        title="Grant Permission"
        modalDialog={modalDialog}
        // handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Name
              </label>
              <Select
                //   defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                name="userId"
                options={options_user}
                onChange={onchangeSelect}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Project Role
              </label>
              <select
                className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('idrole')}
              >
                {options}
              </select>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="my-3 mx-5">
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </div>
          </DialogActions>
        </form>
      </DialogModal>
    </>
  )
}
