import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInput'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from "../../store";
import { usersSelector, updateUser } from '../../slices/users'
import { DialogActions, DialogContent } from '../DialogModal';
import Button from '@material-ui/core/Button'

function UpdateUserModal({ modalDialog }) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { userUpdate } = useSelector(usersSelector)
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(updateUser({id: userUpdate.User_Id, data}))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Details"
        modalDialog={modalDialog}
        handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers className="mx-12">
            <FormInput
              r={register}
              name="fullname"
              label={'Name'}
              value={userUpdate.User_Full_Name}
              required
            />
            <div r={register} name="Username" label={'Username'} value={userUpdate.Username} required />
            <div r={register} name="User_Email" label={'Email'} value={userUpdate.User_Email} required />
            <FormInput
              r={register}
              name="password"
              label={'Password (Để trống nếu không thay đổi)'}
            />
            <FormInput r={register} name="globalrole" label={'Is Admin'} value={userUpdate.Is_Admin} required />
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

export default UpdateUserModal
