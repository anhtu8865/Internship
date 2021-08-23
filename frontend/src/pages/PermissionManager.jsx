import React, { useEffect } from 'react'
import { fetchPermissions,permissionsSelector } from '../slices/permission'
import { fetchPermissionRoles,permissionRolesSelector } from '../slices/per-role'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import PermissionItem from '../components/Permission/PermissionItem'

 const PermissionManager= () => {
    const dispatch = useAppDispatch()
    const { permissions,loading, hasErrors } = useSelector(permissionsSelector)
   
   useEffect(() => {
        dispatch(fetchPermissions()) 
    }, [dispatch])

    const renderPermission = () =>{
        return permissions.map((permission)=>
            <PermissionItem key={permission.Permission_Id} permission={permission} />
        )
    }
    if (loading) {
      return (
        <tr>
          <div className="loader">Loading...</div>
        </tr>
      )
    }
    if (hasErrors) return <p>Unable to get Permission.</p>
    return (
        <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Permission</h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name Permission
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Grant to
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    </th>
                  </tr>
                </thead>
                <tbody>{renderPermission()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}
export default PermissionManager