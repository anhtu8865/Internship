/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUsers, usersSelector, setState } from '../slices/users'
import { Link } from 'react-router-dom'
import UserItem from '../components/User/UserItem';
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

const Users = () => {
  const dispatch = useAppDispatch()
  const { addToast } = useToasts()

  const { users, loading, hasErrors, updateMess, updateSuccess } =
    useSelector(usersSelector)

  // // setup pages control for every table
  // const [pageTable, setPageTable] = useState(1)

  // // // setup data for every table
  // const [dataTable, setDataTable] = useState([])

  // // // pagination setup
  // const resultsPerPage = 10
  // const totalResults = users.length
  // // // pagination change control
  // function onPageChangeTable(p) {
  //   setPageTable(p)
  // }
  //get data user
  useEffect(() => {
    dispatch(fetchUsers())
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
  // // on page change, load new sliced data
  // // here you would make another server request for new data
  // useEffect(() => {
  //   setDataTable(
  //     users.slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage)
  //   )
  // }, [pageTable])

  //render usr
  const renderUsers = () => {
    return users.map((user) => <UserItem key={user.User_Id} user={user} />)
  }
  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Users.</p>

  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h1 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Users Manager
          </h1>
        </div>
        <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex flex-row mb-1 sm:mb-0">
            {/* Ô search */}
            <div className="flex relative">
              <span className="h-full absolute inset-y-0 right-2 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                </svg>
              </span>
              <input
                placeholder="Search"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex">
            <Link to="/create-user">
              <Button>Create User</Button>
            </Link>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <TableContainer className="mb-8">
              <Table className="min-w-full leading-normal">
                <TableHeader>
                  <tr>
                    <TableCell>Full name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Action</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>{renderUsers()}</TableBody>
              </Table>
              {/* <TableFooter>
                <Pagination
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onChange={onPageChangeTable}
                  label="Table navigation"
                />
              </TableFooter> */}
            </TableContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
