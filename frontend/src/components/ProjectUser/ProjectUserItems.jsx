import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store'
import { deleteUser, setRoleUpdate } from '../../slices/pro-user-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { useSelector } from 'react-redux'
import ProjectUserRoleApi from '../../api/pro-user-roleApi'

export default function ProjectUserItems({ dataItem, projectkey }) {
  const dispatch = useAppDispatch()
  function deleteConfirm(e, userId) {
    let dataDelete = {
      UserId: userId,
      ProjectKey: projectkey,
    }
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteUser(dataDelete))
    }
  }
  const [roleId, setroleId] = useState(dataItem.RoleId)
 
  const { roles, loading, hasErrors } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  
 
  var options = roles.map((option) => {
    return (
      <option key={option.Role_Id} value={option.Role_Id}>
        {option.Role_Name}
      </option>
    )
  })
  //update role for user
  const handleChange=(e)=> {
     setroleId(e.target.value)
     let data = {
       projectKey: projectkey,
       userId: dataItem.UserId.toString(),
       roleIdNew: e.target.value,
     }
     ProjectUserRoleApi.updateRoleUserInProject(data).then((res)=>{
       console.log(res)
     })
     .catch((err)=>{
         alert(err.response.data.Msg)
     })
   }
  return (
    <>
      {/* <UpdateUserModal modalDialog={modalUpdate} /> */}
      <tr key={dataItem.UserId}>
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
                {dataItem.UserName}
              </p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {dataItem.UserMail}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            <select value={roleId} onChange={handleChange}>
              {options}
            </select>
          </p>
        </td>
        {/* <div className="grid grid-cols-1 my-4">
          <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
            Project Role
          </label>
          <select>{options}</select>
        </div> */}
        <td className="px-5 py-5 border-b text-center border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 ml-1.5 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, dataItem.UserId)}
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
