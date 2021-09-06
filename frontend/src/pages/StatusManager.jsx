import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchStatuss, statussSelector,setState  } from '../slices/statuss'
import { Link } from 'react-router-dom'
import StatusItem from '../components/Status/StatusItem'
import { useAppDispatch } from '../store'
import { useToasts } from 'react-toast-notifications'
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
  Select
} from '@windmill/react-ui'
const Statuss = () => {
  
  
  const { addToast } = useToasts()
  const dispatch = useAppDispatch()
  const { updateMess, updateSuccess,statuss, loading, hasErrors } = useSelector(statussSelector)
  useEffect(() => {
    dispatch(fetchStatuss())
  }, [dispatch])
  useEffect(() => {
         if (updateSuccess) {
           addToast(" Success", {
               appearance: 'success',
               autoDismiss: true,
           })
           dispatch(setState())
         }
       }, [updateSuccess])

  
    // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1)
  // setup data for every table 
  const [dataTable1, setDataTable1] = useState([])
  // pagination setup
  const resultsPerPage = 5
  const totalResults = statuss.length
  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p)
  }
  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTable1(statuss.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
  }, [statuss,pageTable1])



  //search user
  //setup search
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchResults, setSearchResults] = React.useState([])
  //setup select 
  const [selectTerm, setSelectTerm] = React.useState('')
  const handleChange = (e) => {
    setSearchTerm(e.target.value)
  }
  const handleSelect = (e) =>{
    setSelectTerm(e.target.value)
  }
  useEffect(() => {
    const results = statuss.filter(
      (person) =>
        person.StatusName.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
          -1 
        // person.User_Full_Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
        //   -1
    )
    setSearchResults(results)
  }, [searchTerm])
  useEffect(() => {
    const resultsSelect = statuss.filter(
      (person) => person.WorkflowId == selectTerm
    )
    setSearchResults(resultsSelect)
  }, [selectTerm])
  //render user
  const renderStatus = () => {
    if (
      (searchTerm == '' && selectTerm == 'All') ||
      (searchTerm == '' && selectTerm == '')
    ) {
      if(statuss){
      return dataTable1.map((status) => <StatusItem key={status.StatusId} status={status} />)
      }
      else return <div> NULL STATUS </div>
    } else {
      return searchResults.map((status) => (
        <StatusItem key={status.StatusId} status={status} />
      ))
    }
  }
  
  

  if (loading) {
    return (
      <tr>
        <div className="loader">Loading...</div>
      </tr>
    )
  }
  if (hasErrors) return <p>Unable to get Projects.</p>
  return (
    <div className="container mx-auto px-4 mb-16 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight"> Status</h2>
        </div>
<div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex">
            <Link to="/app/status-manager/create-status">
              <Button >
                Create status
              </Button>
            </Link>
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button        ton>
            </Link> */}
          </div>
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
                value={searchTerm}
                onChange={handleChange}
              />
            </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
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
              <tbody>{renderStatus()}</tbody>
            </table>
            <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable1}
            label="Table navigation"
          />
        </TableFooter>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Statuss
