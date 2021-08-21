import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../store'
import {
  fetchProjectUserRole,
  projectUserRolesSelector,
} from '../slices/pro-user-role'
import { useSelector } from 'react-redux'
import ProjectUserItems from '../components/ProjectUser/ProjectUserItems'
import AddUserToProject from '../components/ProjectUser/AddUserToProject'

export default function ProjectUserRole() {
  let temp = window.location.pathname.split('/')
  let projectkey = temp[temp.length - 1]
  const dispatch = useAppDispatch()
  const { projectUserRoles, loading, hasErrors } = useSelector(
    projectUserRolesSelector
  )
  useEffect(() => {
    dispatch(fetchProjectUserRole(projectkey))
  }, [dispatch])


  const renderUserRole = () => {
      return projectUserRoles.map((projectUserRole) => (
        <ProjectUserItems
          key={projectUserRole.UserId}
          dataItem={projectUserRole}
          projectkey={projectkey}
        ></ProjectUserItems>
      ))
  }
  const [openAddUser, setopenAddUser] = useState(false)
  const handleAddUser = (e) => {
    e.preventDefault()
    setopenAddUser(true)
  }
  const handleCloseAdd = () => {
    setopenAddUser(false)
  }
  const modalUpdate = {
    open: openAddUser,
    handleOpen: handleAddUser,
    handleClose: handleCloseAdd,
    projectkey: projectkey,
    listUser: projectUserRoles,
    // data_permission: temp,
    // fulldata: permissionroles,
  }
  return (
    <>
      <AddUserToProject modalDialog={modalUpdate}></AddUserToProject>
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Project
            </h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
              <a onClick={(e) => handleAddUser(e)}>
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                  Add User
                </button>
              </a>
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{renderUserRole()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
