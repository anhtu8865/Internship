import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchStatuss, statussSelector } from '../slices/statuss'
import { Link } from 'react-router-dom'
import StatusItem from '../components/Status/StatusItem'
import { useAppDispatch } from '../store'

const Statuss = () => {
  
  
  
  const dispatch = useAppDispatch()
  const { statuss, loading, hasErrors } = useSelector(statussSelector)
  useEffect(() => {
    dispatch(fetchStatuss())
  }, [dispatch])
  localStorage.setItem('Status', JSON.stringify(statuss))
  const renderStatus = () => {
    if(statuss){
      console.log(statuss)
      return statuss.map((status) => 
      <StatusItem  key={status.StatusId} status={status} />)
    }
    else return <div> NULL STATUS </div>
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
            <Link to="/create-statuss">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                Create status
              </button>
            </Link>
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button        ton>
            </Link> */}
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
          </div>
        </div>
      </div>
    </div>
  )
}
export default Statuss
