import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchRoles, rolesSelector } from '../slices/roles'
import { Link } from 'react-router-dom'
import RoleItem from '../components/Role/RoleItem'
import { useAppDispatch } from '../store'

const Roles = () => {
  const dispatch = useAppDispatch()
  const { roles, loading, hasErrors } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  const renderRole = () => {
    return roles.map((role) => 
    <RoleItem  key={role.Role_Id} role={role} />)
  }
  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Projects.</p>
  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">Project Role</h2>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex">
            <Link to="/create-roles">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                Create role
              </button>
            </Link>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>{renderRole()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Roles
