import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  fetchWorkflowProjects,
  workflowProjectsSelector,
} from '../../slices/wor-pro'
import { useHistory } from 'react-router-dom'
import { setWorkflowUpdate, updateWorkflow } from '../../slices/workflows'
import workflowApi from '../../api/workflowApi'
import { deleteWorkflow } from '../../slices/workflows'
import WorkflowModal from '../../pages/UpdateWorkflow'
const WorkflowItem = ({ workflow }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [workflowprojects_temp, setResult] = useState([])
  useEffect(() => {
    if (workflow) {
      workflowApi.getWorkflowProject(workflow.WorkflowId).then((data) => {
        setResult(data.Data)
      })
    }
  }, [])

  //get workflow to detail
  const handleOpenUpdate = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    history.push('/create-workflows')
  }
  const handleOpenTransition = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    history.push('/transitions-manager')
  }
  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdateWorkflow = (e, workflow) => {
    e.preventDefault()
    dispatch(setWorkflowUpdate(workflow))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdateWorkflow,
    handleClose: handleCloseUpdate,
  }
  const renderWorkflowProject = () => {
    if (workflowprojects_temp != null) {
      return workflowprojects_temp.map((temp) => (
        <li key={temp.ProjectKey}>{temp.ProjectName}</li>
      ))
    } else {
      return <li></li>
    }
  }
  function deleteConfirm(e, WorkflowId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteWorkflow(WorkflowId))
    }
  }
  return (
    <>
      <WorkflowModal modalDialog={modalUpdate} />
      <tr key={workflow.WorkflowId}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link to="#">
                  <a className="text-blue-400 whitespace-no-wrap">
                    {workflow.WorkflowName}
                    
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <a className="text-red-400 whitespace-no-wrap">
              {workflow.WorkflowId}
            </a>
          </Link>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <a className="text-black-400 whitespace-no-wrap">
              {workflow.WorkflowDescription}
            </a>
          </Link>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <ul className="text-blue-400 whitespace-no-wrap">
              {renderWorkflowProject()}
            </ul>
          </Link>
        </td>

        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-white-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, workflow)}
              className="relative cursor-pointer"
            >
              Add Project
            </a>
          </span>
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenTransition(e, workflow)}
              className="relative cursor-pointer"
            >
              View
            </a>
          </span>
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, workflow.WorkflowId)}
              className="relative cursor-pointer"
            >
              Delete
            </a>
          </span>
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdateWorkflow(e, workflow)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </span>
          {/* <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
                />
                <a
                  // onClick={(e) => deleteConfirm(e,project.Project_Id)}
                  className="relative cursor-pointer text-red-900"
                >
                  Delete
                </a>
              </span> */}
        </td>
      </tr>
    </>
  )
}

export default WorkflowItem
