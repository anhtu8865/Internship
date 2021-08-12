import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { fetchPermissionRoles,permissionRolesSelector } from '../../slices/per-role'
import { useHistory } from 'react-router-dom'
import { setPermissionUpdate} from '../../slices/permission'
import permissionApi from '../../api/permissionApi'
const PermissionItem = ({ permission }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [permissionroles_temp, setResult] = useState([])
  useEffect(() => {
    permissionApi.getPrmissionRole(permission.Permission_Id)
    .then((data)=>{
         setResult(data.Data)
    })
  }, [])

 
  //get permission to detail
  const handleOpenUpdate = (e,permission) => {
    e.preventDefault()
    dispatch(setPermissionUpdate(permission))
    history.push('/detail-permission')
  }


  const renderPermissionRole = () => {
    if (permissionroles_temp != null) {
      return permissionroles_temp.map((temp) => (
        <li key={temp.RoleId}>{temp.RoleName}</li>
      ))
    } else {
      return <li></li>
    }
  }
  return (
    <>
      {/* <RoleModal modalDialog={modalUpdate} /> */}
      <tr key={permission.Permission_Id}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link to="#">
                  <a className="text-blue-400 whitespace-no-wrap">
                    {permission.Permission_Name}
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <a className="text-blue-400 whitespace-no-wrap">
              {permission.Permission_Description}
            </a>
          </Link>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <ul className="text-blue-400 whitespace-no-wrap">
              {renderPermissionRole()}
            </ul>
          </Link>
        </td>

        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
             <a 
              onClick={(e) => handleOpenUpdate(e,permission)}
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
                  // onClick={(e) => deleteConfirm(e,role.Role_Id)}
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

export default PermissionItem
