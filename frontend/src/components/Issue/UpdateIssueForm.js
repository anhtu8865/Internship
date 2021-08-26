import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { updateIssue } from '../../slices/issues'
import { selectIssueById, selectUserList, fetchUserList } from '../../slices/issues'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

export const UpdateIssueForm = ({ match }) => {
  const { issueId } = match.params
  const issue = useSelector((state) => selectIssueById(state, issueId))
  const dispatch = useDispatch()
  const { register, handleSubmit, reset } = useForm()
  const [name, setName] = useState(issue.Name)
  const [key, setKey] = useState(issue.Key)
  const [project, setProject] = useState(issue.Project)
  const [projectName, setProjectName] = useState(issue.Project_Name)
  const [issueTypeName, setIssueTypeName] = useState(issue.Issue_Type_Name)

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
        newIssue.Fields = newIssue.Fields ? newIssue.Fields.map((item) => ({
          ...item,
          Value: data[item.Name],
        })) : []
        setEditRequestStatus('pending')
        history.push(`/IssuesByProject/${project}`)
        const resultAction = await dispatch(updateIssue(newIssue))
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issue: ', err)
      } finally {
        setEditRequestStatus('idle')
      }
    }
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
            <div key={item.Name} className="relative w-full mb-3">
              <label
                className="block uppercase text-gray-700 text-xs font-bold mb-2"
                htmlFor={item.Name}
              >
                {item.Name}
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                {...register(item.Name)}
                defaultValue={item.Value}
                style={{ transition: 'all .15s ease' }}
              />
            </div>
          )
        case 'Date':
          return (
            <div key={item.Name} className="relative w-full mb-3">
              <label
                className="block uppercase text-gray-700 text-xs font-bold mb-2"
                htmlFor={item.Name}
              >
                {item.Name}
              </label>
              <input
                type="date"
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                {...register(item.Name)}
                defaultValue={item.Value}
                style={{ transition: 'all .15s ease' }}
              />
            </div>
          )
        case 'Text area':
          return (
            <div key={item.Name} className="relative w-full mb-3">
              <label
                className="block uppercase text-gray-700 text-xs font-bold mb-2"
                htmlFor={item.Name}
              >
                {item.Name}
              </label>
              <textarea
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                {...register(item.Name)}
                defaultValue={item.Value}
                style={{ transition: 'all .15s ease' }}
              />
            </div>
          )
        case 'People':
          return (
            <div key={item.Name} className="relative w-full mb-3">
              <label
                className="block uppercase text-gray-700 text-xs font-bold mb-2"
                htmlFor={item.Name}
              >
                {item.Name}
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                {...register(item.Name)}
                defaultValue={item.Value}
                style={{ transition: 'all .15s ease' }}
              >
                <option value=""></option>
                {userOptions}
              </select>
            </div>
          )
      }
    })
  }

  return (
    <main>
      <section className="relative w-full h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-gray-500 text-center mb-3 font-bold">
                    <h2>Edit a Issue</h2>
                  </div>
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueName"
                      >
                        Issue Name:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={name}
                        onChange={onNameChanged}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueKey"
                      >
                        Issue Key:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={key}
                        disabled={true}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="projectName"
                      >
                        Project:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={projectName}
                        disabled={true}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueTypeName"
                      >
                        Issue Type:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={issueTypeName}
                        disabled={true}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="status"
                      >
                        {`Status:                                                            ${status}`}
                      </label>

                      <select
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value=""
                        onChange={onStatusChanged}
                        style={{ transition: 'all .15s ease' }}
                      >
                        <option value=""></option>
                        {transitionOptions}
                      </select>
                    </div>
                    {inputFields}
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        onClick={handleSubmit(onSaveIssueClicked)}
                        disabled={!canSave}
                        style={{ transition: 'all .15s ease' }}
                      >
                        Save Issue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
