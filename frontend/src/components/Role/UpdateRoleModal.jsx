import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInput'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { rolesSelector,updateRole } from '../../slices/roles'
import { DialogActions, DialogContent } from '../DialogModal'
import Button from '@material-ui/core/Button'

function UpdateRoleModal({ modalDialog }) {


  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { roleUpdate } = useSelector(rolesSelector)
  console.log("+++")
  console.log(roleUpdate)
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    
    dispatch(updateRole({ id: roleUpdate.Role_Id, data }))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Role"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            <FormInput
              r={register}
              name="Role_Name"
             label={'Role Name'}
              value={roleUpdate.Role_Name}
              required
            />
            <FormInput 
              r={register}
              name="Role_Description"
              label={'Description'}
              value={roleUpdate.Role_Description}
              required
            />
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

export default UpdateRoleModal
