import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteProject, setProjectUpdate } from '../../slices/projects'

import UpdateProjectModal from './UpdateProjectModal';
import ViewProject from './ViewProject';
import { setWorkflowUpdate } from '../../slices/workflows'
import { useHistory } from 'react-router-dom'
import { TableCell, TableRow, Button, Table } from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
const ProjectItem = ({ project }) => {
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()
  const history = useHistory()
  function deleteConfirm(e, project_key) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteProject(project_key))
      //alert('Delete Success!')
      addToast("Delete Success!", {
        appearance: 'success',
        autoDismiss: true,
      })
    }
  }

  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = (e, project) => {
    e.preventDefault()
    dispatch(setProjectUpdate(project))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
  }

  const [openView, setOpenView] = React.useState(false)

  const handleOpenView = (e, project) => {
    e.preventDefault()
    dispatch(setProjectUpdate(project))
    setOpenView(true)
  }
  const handleCloseView = () => {
    setOpenView(false)
  }
  const modalView = {
    open: openView,
    handleOpenViewProject: handleOpenView,
    handleCloseViewProject: handleCloseView,
  }
  const handleOpenTransition = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    history.push('/transitionsforproject-manager')
  }

  return (
    <>
      <UpdateProjectModal modalDialog={modalUpdate} />
      <ViewProject modalDialog={modalView} />
      <TableRow key={project.ProjectKey}>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
              <img
                className="w-full h-full rounded-full"
                src="https://iconarchive.com/download/i78236/igh0zt/ios7-style-metro-ui/MetroUI-Office-Projects.ico"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link
                  to={`/IssuesByProject/${project.ProjectKey}`}
                  className="relative cursor-pointer text-blue-400 whitespace-no-wrap"
                >
                  {project.ProjectName}
                </Link>
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {project.ProjectKey}
          </p>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {project.ProjectUrl}
          </p>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <a className="text-blue-400 whitespace-no-wrap">
              {project.ProjectLeadName}
            </a>
          </Link>
        </TableCell>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {project.WorkflowId}
          </p>
        </TableCell>
        <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, project)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </span>
          <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <Link
              to={`/project-user/${project.ProjectKey}-${project.ProjectName}`}
              className="relative cursor-pointer"
            >
              Access
            </Link>
          </span>
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenTransition(e, project)}
              className="relative cursor-pointer"
            >
              View Workflow
            </a>
          </span>
          <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, project.ProjectKey)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </span>
          
        </TableCell>
      </TableRow>
    </>
  )
}

export default ProjectItem
