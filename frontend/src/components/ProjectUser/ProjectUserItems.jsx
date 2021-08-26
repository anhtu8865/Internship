import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store'
import { deleteUser, setRoleUpdate } from '../../slices/pro-user-role'
import { fetchRoles, rolesSelector } from '../../slices/roles'
import { useSelector } from 'react-redux'
import ProjectUserRoleApi from '../../api/pro-user-roleApi'
import Avatar from '@material-ui/core/Avatar'
import {
  orange,
  purple,
  red,
  blue,
  lime,
  blueGrey,
} from '@material-ui/core/colors'
import { makeStyles } from '@material-ui/core/styles'
//list colour
const colours = [
  blue[800],
  orange[500],
  purple[800],
  red[800],
  lime[500],
  blueGrey[800],
]
//random color
const getColour = () => colours[Math.floor(Math.random() * colours.length)]

const useStyles = makeStyles(() => ({
  backgroundColor: {
    color: '#fff',
    backgroundColor: getColour(),
  },
}))
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
  const handleChange = (e) => {
    setroleId(e.target.value)
    let data = {
      projectKey: projectkey,
      userId: dataItem.UserId.toString(),
      roleIdNew: e.target.value,
    }
    ProjectUserRoleApi.updateRoleUserInProject(data)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        alert(err.response.data.Msg)
      })
  }

  ////get avatar user
  const classes = useStyles()
  const Ava = () => {
    let result = []
    dataItem.UserName.split('').forEach((letter) => {
      result.push(letter)
    })
    return <Avatar className={classes.backgroundColor}>{result[0]}</Avatar>
  }
  return (
    <>
      {/* <UpdateUserModal modalDialog={modalUpdate} /> */}
      <tr key={dataItem.UserId}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">{Ava()}</div>
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
