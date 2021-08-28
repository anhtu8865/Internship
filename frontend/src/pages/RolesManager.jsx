import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchRoles, rolesSelector, setState } from '../slices/roles'
import { Link } from 'react-router-dom'
import RoleItem from '../components/Role/RoleItem'
import { useAppDispatch } from '../store'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

const Roles = () => {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()

  const {updateMess, updateSuccess, roles, loading, hasErrors } = useSelector(rolesSelector)
  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])
  //notification delete,update
   useEffect(() => {
     if (updateSuccess) {
       addToast(updateMess, {
         appearance: 'success',
         autoDismiss: true,
       })
       dispatch(setState())
     }
   }, [updateSuccess])
   //render roles
  const renderRole = () => {
    return roles.map((role) => <RoleItem key={role.Role_Id} role={role} />)
  }
  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Roles.</p>

  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <div>
            <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Project Role
            </h1>
          </div>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0"></div>
          <div className="flex">
            <Link to="/create-roles">
              <Button>Create role</Button>
            </Link>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <TableContainer className="mb-8">
              <Table className="min-w-full leading-normal">
                <TableHeader>
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
                </TableHeader>
                <TableBody>{renderRole()}</TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Roles
