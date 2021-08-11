import React from 'react'
import DialogModal from '../DialogModal'
import { DialogActions, DialogContent } from '../DialogModal'
import FormInput from '../Form/FormInput'
import Button from '@material-ui/core/Button'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../store'
import { AddRoleToPermission } from '../../slices/per-role'

export default function UpdateRolePermission({ modalDialog }) {
  const { handleClose } = modalDialog
  // console.log("data")
  // console.log(modalDialog.data.Permission_Id)
  const dispatch = useAppDispatch()

  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => {
    const postdata = {
      idpermission: modalDialog.data.Permission_Id.toString(),
      idrole: data.idrole
    }
    dispatch(AddRoleToPermission(postdata))
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
            <FormInput
                r={register}
                name="idrole"
               label={'Role Name'}
                // value={roleUpdate.Role_Name}
                required
              />
            {/* <FormInput 
                r={register}
                name="roledescription"
                label={'Description'}
                value={roleUpdate.Role_Description}
                
              /> */}
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
