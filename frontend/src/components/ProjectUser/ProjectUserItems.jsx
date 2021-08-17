import React, { useEffect, useState } from 'react'

export default function ProjectUserItems({projectUserRole}) {
  return (
    <>
      {/* <UpdateUserModal modalDialog={modalUpdate} /> */}
      <tr key={projectUserRole.UserId}>
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
                {projectUserRole.UserName}
              </p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {projectUserRole.UserMail}
          </p>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {projectUserRole.RoleName}
          </p>
        </td>
      
        <td className="px-5 py-5 border-b text-center border-gray-200 bg-white text-sm">
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              //   onClick={(e) => handleOpenUpdate(e, user)}
              className="relative cursor-pointer"
            >
              Edit
            </a>
          </span>
          <span className="relative inline-block px-3 py-1 ml-1.5 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
            />
            <a
              //   onClick={(e) => deleteConfirm(e, user.User_Id)}
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
