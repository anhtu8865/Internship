import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { addNewIssue, fetchCustomFields } from '../../slices/issues'
import {
  selectAllProjectIssueTypeScreens,
  selectUserList,
  fetchProjectIssueTypeScreens,
  fetchUserList,
  setErrorNull,
  setSuccessNull,
} from '../../slices/issues'
import { useForm } from 'react-hook-form'
import { useToasts } from 'react-toast-notifications'
import {
  Input,
  Label,
  Select,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@windmill/react-ui'

export const AddIssueForm = () => {
  const { addToast } = useToasts()
  const { register, handleSubmit, reset } = useForm()
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [projectName, setProjectName] = useState('')
  const [issueTypeName, setIssueTypeName] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const success = useSelector((state) => state.issues.success)
  const error = useSelector((state) => state.issues.error)

  const dispatch = useDispatch()
  const projectIssueTypeScreens = useSelector(selectAllProjectIssueTypeScreens)
  const userList = useSelector(selectUserList)

  const filteredProjects = projectIssueTypeScreens
    .map((item) => item.Project_Name)
    .filter((value, index, self) => self.indexOf(value) === index)

  const filteredIssueTypes = projectIssueTypeScreens.filter(
    (item) => item.Project_Name === projectName
  )

  const projectsOptions = filteredProjects.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))
  const userOptions = userList.map((item) => (
    <option key={item.User_Id} value={item.User_Full_Name}>
      {item.User_Full_Name}
    </option>
  ))
  const issueTypesOptions = filteredIssueTypes.map((item) => (
    <option key={item.Issue_Type_Name} value={item.Issue_Type_Name}>
      {item.Issue_Type_Name}
    </option>
  ))

  const issueStatus = useSelector((state) => state.issues.statusAddIssue)
  const customFields = useSelector((state) => state.issues.customFields)
  useEffect(() => {
    if (issueStatus === 'idle') {
      dispatch(fetchProjectIssueTypeScreens())
    }
    if ([projectName, issueTypeName].every(Boolean)) {
      const { Screen } = projectIssueTypeScreens.find(
        (element) =>
          element.Project_Name === projectName &&
          element.Issue_Type_Name === issueTypeName
      )
      if (Screen) {
        dispatch(fetchCustomFields({ Id: Screen }))
      }
      const { Project } = projectIssueTypeScreens.find(
        (element) => element.Project_Name === projectName
      )
      if (Project) {
        dispatch(fetchUserList({ project: Project }))
      }
    }
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
      dispatch(setErrorNull({ error: null }))
    }
    if (success) {
      addToast(success, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setSuccessNull({ success: null }))
    }
  }, [issueStatus, dispatch, projectName, issueTypeName, error, success])

  const onNameChanged = (e) => setName(e.target.value)
  const onKeyChanged = (e) => setKey(e.target.value)
  const onIssueTypeChanged = (e) => setIssueTypeName(e.target.value)
  const onProjectChanged = (e) => setProjectName(e.target.value)
  const canSave =
    [name, key, projectName, issueTypeName].every(Boolean) &&
    addRequestStatus === 'idle'

  const onSaveIssueClicked = async (data) => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setName('')
        setKey('')
        reset()
        //setProjectName('')
        //setIssueTypeName('')
        
        
        const found = projectIssueTypeScreens.find(
          (element) =>
            element.Project_Name === projectName &&
            element.Issue_Type_Name === issueTypeName
        )
        const result = customFields.map((item) => ({
          ...item,
          Value: data[item.Name],
          Issue: key,
        }))
        const resultAction = await dispatch(
          addNewIssue({
            Key: key,
            Name: name,
            Project: found.Project,
            Issue_Type: found.Issue_Type,
            Icon: found.Issue_Type_Icon,
            Fields: result,
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issue: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }
  function openModal() {
    setIsModalOpen(true)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  let inputFields
  if (customFields && customFields.length !== 0) {
    inputFields = customFields.map((item) => {
      switch (item.Field_Type) {
        case 'Text':
          return (
            <Label key={item.Custom_Field} className="m-2">
              <span>{item.Name}</span>
              <Input className="mt-1" {...register(item.Name)} />
            </Label>
          )
        case 'Date':
          return (
            <Label key={item.Custom_Field} className="m-2">
              <span>{item.Name}</span>
              <Input type="date" className="mt-1" {...register(item.Name)} />
            </Label>
          )
        case 'Text area':
          return (
            <Label key={item.Custom_Field} className="m-2">
              <span>{item.Name}</span>
              <Textarea className="mt-1" rows="3" {...register(item.Name)} />
            </Label>
          )
        case 'People':
          return (
            <Label key={item.Custom_Field} className="m-2">
              <span>{item.Name}</span>
              <Select className="mt-1" {...register(item.Name)}>
                <option value=""></option>
                {userOptions}
              </Select>
            </Label>
          )
      }
    })
  }

  return (
    <>
      <div>
        <Button onClick={openModal}>Create</Button>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="m-2">Add a issue</ModalHeader>
        <ModalBody class="overflow-auto h-80">
          <Label className="m-2">
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={onNameChanged} />
          </Label>
          <Label className="m-2">
            <span>Key</span>
            <Input className="mt-1" value={key} onChange={onKeyChanged} />
          </Label>

          <Label className="m-2">
            <span>Project</span>
            <Select
              className="mt-1"
              value={projectName}
              onChange={onProjectChanged}
            >
              <option value=""></option>
              {projectsOptions}
            </Select>
          </Label>
          <Label className="m-2">
            <span>Issue type</span>
            <Select
              className="mt-1"
              value={issueTypeName}
              onChange={onIssueTypeChanged}
            >
              <option value=""></option>
              {issueTypesOptions}
            </Select>
          </Label>
          {inputFields}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              onClick={handleSubmit(onSaveIssueClicked)}
              disabled={!canSave}
            >
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
