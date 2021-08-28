import React from 'react'
import DialogModal from '../DialogModal'
import FormInput from '../Form/FormInput'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from "../../store";
import { createProject } from '../../slices/projects'
import { DialogActions, DialogContent } from '../DialogModal';
// import Button from '@material-ui/core/Button'
import { Button } from '@windmill/react-ui';
import { useToasts } from 'react-toast-notifications'

function CreateProjectModal({ modalDialog }) {
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const { handleClose } = modalDialog
  const onSubmit = (data) => {
    dispatch(createProject(data))
    console.log(data)
    addToast("Create Workflow Success", {
      appearance: 'success',
      autoDismiss: true,
    })
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

          
          {/*<input {...register('DefaultAssignee')} className="hidden" defaultValue="22" />*/}
        </DialogContent>
        <DialogActions>
          <div className="hidden sm:block m-2">
             <Button layout="outline" onClick={handleClose}>
                 Cancel
             </Button>
          </div>
          <div className="hidden sm:block m-2">
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
