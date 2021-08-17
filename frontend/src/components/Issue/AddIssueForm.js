import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { addNewIssue } from '../../slices/issues'
import {
  selectAllProjectIssueTypeScreens,
  fetchProjectIssueTypeScreens,
} from '../../slices/issues'

export const AddIssueForm = () => {
  const [name, setName] = useState('')
  const [key, setKey] = useState('')
  const [projectName, setProjectName] = useState('')
  const [issueTypeName, setIssueTypeName] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()
  const projectIssueTypeScreens = useSelector(selectAllProjectIssueTypeScreens)

  const filteredProjects = projectIssueTypeScreens
    .map((item) => item.Project_Name)
    .filter((value, index, self) => self.indexOf(value) === index)

  const filteredIssueTypes = projectIssueTypeScreens
    .filter(item => item.Project_Name === projectName)
  
  const projectsOptions = filteredProjects.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))
  const issueTypesOptions = filteredIssueTypes.map(
    (item) => (
      <option
        key={item.Issue_Type_Name}
        value={item.Issue_Type_Name}
      >
        {item.Issue_Type_Name}
      </option>
    )
  )

  const issueStatus = useSelector((state) => state.issues.statusAddIssue)
  const error = useSelector((state) => state.issues.error)
  useEffect(() => {
    if (issueStatus === 'idle') {
      dispatch(fetchProjectIssueTypeScreens())
    }
  }, [issueStatus, dispatch])

  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onKeyChanged = (e) => setKey(e.target.value)
  const onIssueTypeChanged = (e) => setIssueTypeName(e.target.value)
  const onProjectChanged = (e) => setProjectName(e.target.value)

  const canSave =
    [name, key, projectName, issueTypeName].every(Boolean) &&
    addRequestStatus === 'idle'

  const onSaveIssueClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setName('')
        setKey('')
        setProjectName('')
        setIssueTypeName('')
        //history.push(`/issues`)
        const found = projectIssueTypeScreens.find(element => element.Project_Name === projectName && element.Issue_Type_Name === issueTypeName);
        console.log(found, "da tim thay");
        const resultAction = await dispatch(
          addNewIssue({
            Key: key,
            Name: name,
            Project: found.Project,
            Issue_Type:found.Issue_Type,
            Icon: found.Issue_Type_Icon
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

  return (
    <main>
      <section className="absolute w-full h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-gray-500 text-center mb-3 font-bold">
                    <h2>Add a New Issue</h2>
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
                        //placeholder="Email"
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
                        //placeholder="Email"
                        value={key}
                        onChange={onKeyChanged}
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
                      <select
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={projectName}
                        onChange={onProjectChanged}
                        style={{ transition: 'all .15s ease' }}
                      >
                        <option value=""></option>
                        {projectsOptions}
                      </select>
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueTypeName"
                      >
                        Issue Type:
                      </label>
                      <select
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={issueTypeName}
                        onChange={onIssueTypeChanged}
                        style={{ transition: 'all .15s ease' }}
                      >
                        <option value=""></option>
                        {issueTypesOptions}
                      </select>
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        onClick={onSaveIssueClicked}
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