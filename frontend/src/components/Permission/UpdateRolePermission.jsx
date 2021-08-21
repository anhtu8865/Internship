import React, { useEffect } from 'react'
import DialogModal from '../DialogModal'
import { DialogActions, DialogContent } from '../DialogModal'
import FormInput from '../Form/FormInput'
import Button from '@material-ui/core/Button'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store'
import { AddRoleToPermission } from '../../slices/per-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { useSelector } from 'react-redux'

export default function UpdateRolePermission({ modalDialog }) {
  const { handleClose, fulldata, data_permission } = modalDialog
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm()
  const { roles, loading, hasErrors } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  const onSubmit = (data) => {
    let role_name
    roles.map((temp) => {
      if (temp.Role_Id == data.idrole) {
        role_name = temp.Role_Name
      }
    })
    //data gửi qua slice
    const postdata = {
      idpermission: data_permission.Permission_Id.toString(), //props
      idrole: data.idrole,
      RoleName: role_name,
      RoleId: data.idrole,
      PermissionId: data_permission.Permission_Id.toString(),
    }
    dispatch(AddRoleToPermission(postdata))
    handleClose()
  }
  //filter role which permission don't aleardy

   
   const temp = roles.filter(
     (item1) => !fulldata.some((item2) => item1.Role_Id === item2.RoleId)
   )
  var options = temp.map((option) => {
    return (
      <option key={option.Role_Id} value={option.Role_Id}>
        {option.Role_Name}
      </option>
    )
  })

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
