import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { Link, useLocation } from 'react-router-dom'
import {
  addNewProjectIssueTypeScreen,
  deleteProjectIssueTypeScreen,
  setErrorNull,
  setSuccessNull,
} from '../slices/projectIssueTypeScreens'
import { selectAllScreens } from '../slices/screens'
import { selectAllProjects } from '../slices/projects'
import { useToasts } from 'react-toast-notifications'

const ProjectIssueTypeScreenExcerpt = ({
  projectIssueTypeScreen,
  deleteRow,
}) => {
  const dispatch = useDispatch()
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteProjectIssueTypeScreen({ Id })).then((res) =>
      deleteRow(res.payload.Data.Id)
    )
  }
  return (
    <tr key={projectIssueTypeScreen.Id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {projectIssueTypeScreen.Project}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {projectIssueTypeScreen.ProjectName}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {projectIssueTypeScreen.ScreenName}
        </p>
      </td>
      <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          />
          <a
            onClick={(e) => deleteConfirm(e, projectIssueTypeScreen.Id)}
            className="relative cursor-pointer text-red-900"
          >
            Delete
          </a>
        </span>
      </td>
    </tr>
  )
}

export const ProjectIssueTypeScreens = () => {
  const { addToast } = useToasts()
  const location = useLocation()
  const issueType = location.state?.issueType
  const [rows, setRows] = useState(
    location.state?.projectIssueTypeScreensHaveName
  )

  // code below add new project issue type screen
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)
  const projects = useSelector(selectAllProjects)
  const filteredProjects = projects.filter(
    (item1) => !rows.some((item2) => item1.ProjectKey === item2.Project)
  )

  const filteredScreensOptions = screens.map((screen) => (
    <option key={screen.Id} value={screen.Id}>
      {screen.Name}
    </option>
  ))
  const filteredProjectsOptions = filteredProjects.map((project) => (
    <option key={project.ProjectKey} value={project.ProjectKey}>
      {project.ProjectName}
    </option>
  ))

  const [screen, setScreen] = useState('')
  const onScreenChanged = (e) => setScreen(e.target.value)
  const [project, setProject] = useState('')
  const onProjectChanged = (e) => setProject(e.target.value)
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const canSave =
    [screen, project].every(Boolean) && addRequestStatus === 'idle'

  const onSaveClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setScreen('')
        setProject('')
        const resultAction = await dispatch(
          addNewProjectIssueTypeScreen({
            Project: project,
            Issue_Type: issueType.Id,
            Screen: Number(screen),
          })
        ).then((res) => {
          let result = [res.payload.Data]
          const projectIssueTypeScreensHaveName = []
          result.forEach((element) => {
            screens.forEach((ele) => {
              if (element.Screen === ele.Id) {
                projectIssueTypeScreensHaveName.push({
                  ...element,
                  ScreenName: ele.Name,
                })
              }
            })
          })
          projectIssueTypeScreensHaveName.forEach((element) => {
            projects.forEach((ele) => {
              if (element.Project === ele.ProjectKey) {
                element.ProjectName = ele.ProjectName
              }
            })
          })
          setRows((oldArray) => [
            ...oldArray,
            ...projectIssueTypeScreensHaveName,
          ])
        })
      } catch (err) {
        console.error('Failed to save the customField: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const projectIssueTypeScreenStatus = useSelector(
    (state) => state.projectIssueTypeScreens.status
  )
  const error = useSelector((state) => state.projectIssueTypeScreens.error)
  const success = useSelector((state) => state.projectIssueTypeScreens.success)
  useEffect(() => {
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
      dispatch(setErrorNull({error: null}))
    }
    if (success) {
      addToast(success, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setSuccessNull({success: null}))
    }
  }, [projectIssueTypeScreenStatus, dispatch, error, success])

  const deleteRow = (Id) => {
    const result = rows.filter((ele) => ele.Id !== Id)
    setRows(result)
  }
  let content

  let tbody = rows?.map((projectIssueTypeScreen) => (
    <ProjectIssueTypeScreenExcerpt
      key={projectIssueTypeScreen.Id}
      projectIssueTypeScreen={projectIssueTypeScreen}
      deleteRow={deleteRow}
    />
  ))
  content = (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">
            {`Issue Type name: ${issueType.Name}`}
          </h2>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            <div className="relative">
              <select className="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option selected disabled>
                  Row per page
                </option>
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select className="appearance-none h-full rounded-r border-t sm:rounded-r-none border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                <option selected disabled>
                  Status
                </option>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* Ô search */}
            <div className="flex relative">
              <span className="h-full absolute inset-y-0 right-2 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                placeholder="Search"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <label
              className="bg-white  px-3 py-1.5 rounded-md"
              htmlFor="screenType"
            >
              Screen:
            </label>
            <select
              className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700"
              value={screen}
              onChange={onScreenChanged}
              style={{ transition: 'all .15s ease' }}
            >
              <option value=""></option>
              {filteredScreensOptions}
            </select>
          </div>
          <div className="flex">
            <label
              className="bg-white  px-3 py-1.5 rounded-md"
              htmlFor="screenType"
            >
              Project:
            </label>
            <select
              className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700"
              value={project}
              onChange={onProjectChanged}
              style={{ transition: 'all .15s ease' }}
            >
              <option value=""></option>
              {filteredProjectsOptions}
            </select>
          </div>

          <div className="flex">
            <button
              className="bg-green-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
              type="button"
              onClick={onSaveClicked}
              disabled={!canSave}
              style={{ transition: 'all .15s ease' }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Project Key
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Screen Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{tbody}</tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing 1 to 4 of 50 Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                  Prev
                </button>
                <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return <section className="projectIssueTypeScreens-list">{content}</section>
}
