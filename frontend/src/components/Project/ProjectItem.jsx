import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteProject, setProjectUpdate } from '../../slices/projects'
import UpdateProjectModal from './UpdateProjectModal';


const ProjectItem = ({ project }) => {
  const dispatch = useAppDispatch()

  function deleteConfirm(e, projectId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteProject(projectId))
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


  return (
    <>
      <UpdateProjectModal modalDialog={modalUpdate} />
      <tr key={project.ProjectId}>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10">
                  <img
                    className="w-full h-full rounded-full"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">
                    <Link to="#">
                      <a className="text-blue-400 whitespace-no-wrap">
                        {project.ProjectName}
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">{project.ProjectKey}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">{project.ProjectUrl}L</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {project.ProjectLead}
                </a>
              </Link>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p className="text-gray-900 whitespace-no-wrap">
                {project.DefaultAssignee}
              </p>
            </td>
            <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                />
                <a
                onClick={(e) => handleOpenUpdate(e, project)} 
                className="relative cursor-pointer">Edit</a>
              </span>
              <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
                />
                <a
                  onClick={(e) => deleteConfirm(e, project.ProjectId)}
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

export default ProjectItem
