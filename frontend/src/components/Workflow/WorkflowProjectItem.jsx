import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteProjectInWorkflow } from '../../slices/wor-pro'
export default function WorkflowProjectItem({ workflow_project }) {

  const dispatch = useAppDispatch()

  function deleteConfirm(e, WorkflowId, ProjectKey) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteProjectInWorkflow(WorkflowId,ProjectKey))
    }
  }


  
  return (
    <>
      {/* <ProjectModal modalDialog={modalUpdate} /> */}
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link to="#">
                  <a className="text-blue-400 whitespace-no-wrap">
                    {workflow_project.ProjectName}
                    
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </td>
        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <Link to="#">
              <a className="text-blue-400 whitespace-no-wrap">
                {workflow.Workflow_Description}
              </a>
            </Link>
          </td> */}
        {/* <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <Link to="#">
              <ul className="text-blue-400 whitespace-no-wrap">
                {renderWorkflowProject()}
              </ul>
            </Link>
          </td> */}

        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              />
               <a 
                // onClick={(e) => handleOpenUpdate(e,workflow)}
                className="relative cursor-pointer"
              >
                Edit
              </a>
            </span> */}
          <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, workflow_project.WorkflowId,workflow_project.ProjectKey)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </span>
        </td>
      </tr>
    </>
  )
}
