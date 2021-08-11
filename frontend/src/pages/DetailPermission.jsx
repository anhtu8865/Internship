import React,{ useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { permissionsSelector } from '../slices/permission'
import { fetchPermissionRoles, permissionRolesSelector } from '../slices/per-role'
import { useAppDispatch } from '../store'
import PermissionRoleItem from '../components/Permission/PermissionRoleItem'

export default function DetailPermission() {
  const { permissionUpdate } = useSelector(permissionsSelector)
  //lưu vào localStorage
  if(permissionUpdate.Permission_Id)
  {
  localStorage.setItem("Permission",JSON.stringify(permissionUpdate))
  }
  let temp =  JSON.parse(localStorage.getItem("Permission") || "[]");
  const dispatch = useAppDispatch()
  const { permissionroles, loading, hasErrors } = useSelector(permissionRolesSelector)
  useEffect(() => {
    dispatch(fetchPermissionRoles(temp.Permission_Id))
  }, [dispatch])
  
  const renderPermissionRole = () => {
      return permissionroles.map((temp_role) => (
        <PermissionRoleItem key={temp_role.RoleId} permission_role={temp_role}></PermissionRoleItem>
      ))
  }

  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">{temp.Permission_Name}</h2>
          <p className=" font-semibold leading-tight">{temp.Permission_Description}</p>
        </div>

        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role Name
                  </th>
                  {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th> */}
                  {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th> */}
                  {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Group name
                  </th> */}
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
               <tbody>{renderPermissionRole()}</tbody> 
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
