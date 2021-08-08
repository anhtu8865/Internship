import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInput'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { usersSelector, updateUser } from '../../slices/users'
import { DialogActions, DialogContent } from '../DialogModal'
// import FormSelect from '../Form/FormSelect'

import Button from '@material-ui/core/Button'

function UpdateUserModal({ modalDialog }) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { userUpdate } = useSelector(usersSelector)
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(updateUser({ id: userUpdate.User_Id, data }))
    handleClose()
  }
  return (
    <>
      <DialogModal
        title="Details"
        modalDialog={modalDialog}
        // handleSubmit={handleSubmit(onSubmit)}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="mx-12">
            {/* <div className="mb-5 w-full relative z-0">
              <input
                className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 
    border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-green-800 border-gray-200"
                type="text"
                defaultValue={userUpdate.User_Full_Name}
                placeholder=" "
                name="fullname"
                {...register("fullname")}
                required
              />
              <label
                htmlFor="name"
                className="absolute duration-300 
    top-3 origin-0 text-gray-500 -z-1"
              >
                Name
              </label>
            </div> */}
            <FormInput
              type="text"
              r={register}
              name="fullname"
              label={'Name'}
              value={userUpdate.User_Full_Name}
              required
            />
            <FormInput
              readOnly={true}
              r={register}
              name="Username"
              label={'Username'}
              value={userUpdate.Username}
              required
            />
            <FormInput
              r={register}
              name="User_Email"
              label={'Email'}
              value={userUpdate.User_Email}
              required
            />
            <FormInput
              r={register}
              name="password"
              label={'Password (Để trống nếu không thay đổi)'}
            />
            {/* <FormSelect
              r={register}
              name="globalrole"
              label={'Is Admin'}
              value={userUpdate.Is_Admin}
            /> */}
            <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Global Role
              </label>
              <select  className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
              {...register("globalrole")}
              >
                <option value="0">Admin</option>
                <option value="1">Trusted</option>
                <option value="2">Member</option>

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

export default UpdateUserModal
