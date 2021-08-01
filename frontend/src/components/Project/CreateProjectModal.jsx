import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInput'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from "../../store";
import { createProject } from '../../slices/projects'
import { DialogActions, DialogContent } from '../DialogModal';
import Button from '@material-ui/core/Button'

function CreateProjectModal({ modalDialog }) {
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(createProject(data))
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
          <FormInput r={register} name="ProjectName" label={'Name'} required />
          <FormInput r={register} name="ProjectKey" label={'Key'} required />
          <FormInput r={register} name="ProjectLead" label={'Project Lead'} type="number" required />
          <input {...register('DefaultAssignee')} className="hidden" defaultValue="22" />
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

export default CreateProjectModal
