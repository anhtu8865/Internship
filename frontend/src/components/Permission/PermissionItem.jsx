import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { fetchPermissionRoles,permissionRolesSelector } from '../../slices/per-role'

const PermissionItem = ({ permission }) => {
  const [permissionroles_temp, setResult] = useState([])
  useEffect(() => {
    const getData = async () => {
      let temp = await axios({
        method: 'get',
        url:
          'http://localhost:5001/api/permission/permission-role?id=' +
          permission.Permission_Id,
      })
      setResult(temp.data.Data)
      // dispatch({ type: 'UPDATE', data: temp.data })
    }
    getData()
  }, [])

  // function deleteConfirm(e, roleId) {
  //   e.preventDefault()
  //   if (confirm('Delete?')) {
  //     dispatch(deleteRole(roleId))
  //   }
  // }
  // const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = () => {

  }
  // const handleCloseUpdate = () => {
  //   setOpenUpdate(false)
  // }
  // const modalUpdate = {
  //   open: openUpdate,
  //   handleOpen: handleOpenUpdate,
  //   handleClose: handleCloseUpdate,
  // }
  // const { permissionroles } = useSelector(permissionRolesSelector)
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   fetchPermissionRoles(permission.Permission_Id)
  // }, [dispatch])
  // console.log(permissionroles)



  const renderPermissionRole = () => {
    if (permissionroles_temp != null) {
      return permissionroles_temp.map((temp) => (
        <li key={temp.RoleId}>{temp.RoleName}</li>
      ))
    } else {
      return <li>null</li>
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
             <Link to ="/detail-permission"
              // onClick={(e) => handleOpenUpdate(e)}
              className="relative cursor-pointer"
            >
              Edit
            </Link>
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
