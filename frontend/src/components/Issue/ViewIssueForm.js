import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { updateIssue } from '../../slices/issues'
import {
  selectIssueById,
  selectUserList,
  fetchUserList,
} from '../../slices/issues'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
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
  Badge,
} from '@windmill/react-ui'

export const ViewIssueForm = ({ issueId }) => {
  const issue = useSelector((state) => selectIssueById(state, issueId))
  const dispatch = useDispatch()
  const { register, handleSubmit, reset } = useForm()
  const [name, setName] = useState(issue.Name)
  const [key, setKey] = useState(issue.Key)
  const [project, setProject] = useState(issue.Project)
  const [projectName, setProjectName] = useState(issue.Project_Name)
  const [issueTypeName, setIssueTypeName] = useState(issue.Issue_Type_Name)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [status, setStatus] = useState(issue.Status)
  const [editRequestStatus, setEditRequestStatus] = useState('idle')
  const userList = useSelector(selectUserList)
  useEffect(() => {
    if (project) {
      dispatch(fetchUserList({ project: project }))
    }
  }, [dispatch])
  const onNameChanged = (e) => setName(e.target.value)
  const onStatusChanged = (e) => setStatus(e.target.value)
  const canSave =
    [name, key, status].every(Boolean) && editRequestStatus === 'idle'
  const history = useHistory()
  const onSaveIssueClicked = async (data) => {
    if (canSave) {
      try {
        const newIssue = { ...issue, Key: key, Name: name, Status: status }
        newIssue.Fields = newIssue.Fields
          ? newIssue.Fields.map((item) => ({
              ...item,
              Value: data[item.Name],
            }))
          : []
        setEditRequestStatus('pending')
        const resultAction = await dispatch(updateIssue(newIssue))
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issue: ', err)
        setName(issue.Name)
        reset({})
      } finally {
        setEditRequestStatus('idle')
        closeModal()
      }
    }
  }
  function openModal() {
    setIsModalOpen(true)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  const userOptions = userList.map((item) => (
    <option key={item.User_Id} value={item.User_Full_Name}>
      {item.User_Full_Name}
    </option>
  ))
  const transitionOptions = issue.Transitions?.map((item) => (
    <option key={item.Id_Transition} value={item.Name_Status2}>
      {`${item.Name_Transition} -> ${item.Name_Status2}`}
    </option>
  ))
  let inputFields
  if (issue.Fields && issue.Fields.length !== 0) {
    inputFields = issue.Fields.map((item) => {
      switch (item.Field_Type) {
        case 'Text':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Input
                className="mt-1"
                {...register(item.Name)}
                defaultValue={item.Value}
                disabled={true}
              />
            </Label>
          )
        case 'Date':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Input
                type="date"
                className="mt-1"
                {...register(item.Name)}
                defaultValue={item.Value}
                disabled={true}
              />
            </Label>
          )
        case 'Text area':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Textarea
                className="mt-1"
                {...register(item.Name)}
                defaultValue={item.Value}
                disabled={true}
              />
            </Label>
          )
        case 'People':
          return (
            <Label key={item.Name} className="m-2">
              <span>{item.Name}</span>
              <Select
                className="mt-1"
                {...register(item.Name)}
                defaultValue={item.Value}
                disabled={true}
              >
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
      <Badge
        className="hover:bg-green-200 cursor-pointer"
        type={'primary'}
        onClick={openModal}
      >
        View
      </Badge>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader className="m-2">Edit a issue</ModalHeader>
        <ModalBody class="overflow-auto h-80">
          <Label className="m-2 disabled:opacity-50">
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={onNameChanged} disabled={true} />
          </Label>
          <Label className="m-2">
            <span>Key</span>
            <Input className="mt-1" value={key} disabled={true} />
          </Label>
          <Label className="m-2">
            <span>Project</span>
            <Input
              className="mt-1"
              placeholder="Jane Doe"
              value={projectName}
              disabled={true}
            />
          </Label>
          <Label className="m-2">
            <span>Issue type</span>
            <Input
              className="mt-1"
              placeholder="Jane Doe"
              value={issueTypeName}
              disabled={true}
            />
          </Label>

          <Label className="m-2">
            <span>{status}</span>
            <Select className="mt-1" value="" onChange={onStatusChanged} disabled={true}>
              <option value=""></option>
              {transitionOptions}
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
          {/* <div className="hidden sm:block">
            <Button
              onClick={handleSubmit(onSaveIssueClicked)}
              disabled={!canSave}
            >
              Accept
            </Button>
          </div> */}
        </ModalFooter>
      </Modal>
    </>
  )
}
