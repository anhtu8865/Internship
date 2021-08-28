import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteRoleInPermission } from '../../slices/per-role'
import { TableCell, TableRow, Button } from '@windmill/react-ui'

export default function PermissionRoleItem({ permission_role }) {

  const dispatch = useAppDispatch()

  function deleteConfirm(e, PermissionId, RoleId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteRoleInPermission(PermissionId,RoleId))
    }
  }


  
  return (
    <>
      {/* <RoleModal modalDialog={modalUpdate} /> */}
      <TableRow>
        <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link to="#">
                  <a className="text-blue-400 whitespace-no-wrap">
                    {permission_role.RoleName}
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, permission_role.PermissionId,permission_role.RoleId)}
              className="relative cursor-pointer text-red-900"
            >
              Delete
            </a>
          </span>
        </TableCell>
      </TableRow>
    </>
  )
}
