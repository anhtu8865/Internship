import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllIssueTypes,
  fetchIssueTypes,
  deleteIssueType,
} from '../slices/issueTypes'

const IssueTypeExcerpt = ({ issueType }) => {
  const dispatch = useDispatch()
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteIssueType({ Id }))
  }
  return (
    <tr key={issueType.Id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {issueType.Name}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {issueType.Icon}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {issueType.Description}
        </p>
      </td>
      <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
          />
          <Link
            to={`/editIssueType/${issueType.Id}`}
            className="relative cursor-pointer"
          >
            Edit
          </Link>
        </span>
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          />
          <a
            onClick={(e) => deleteConfirm(e, issueType.Id)}
            className="relative cursor-pointer text-red-900"
          >
            Delete
          </a>
        </span>
      </td>
    </tr>
  )
}

export const IssueTypes = () => {
  const dispatch = useDispatch()
  const issueTypes = useSelector(selectAllIssueTypes)

  const issueTypeStatus = useSelector((state) => state.issueTypes.status)
  const error = useSelector((state) => state.issueTypes.error)
  useEffect(() => {
    if (issueTypeStatus === 'idle') {
      dispatch(fetchIssueTypes())
    }
  }, [issueTypeStatus, dispatch])
  let content

  if (issueTypeStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (issueTypeStatus === 'succeeded') {
    let tbody = issueTypes.map((issueType) => (
      <IssueTypeExcerpt key={issueType.Id} issueType={issueType} />
    ))
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              IssueTypes
            </h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex flex-row mb-1 sm:mb-0">
              <div className="relative">
                <select className="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option selected disabled>
                    IssueType per page
                  </option>
                  <option>5</option>
                  <option>10</option>
                  <option>20</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <select className="appearance-none h-full rounded-r border-t sm:rounded-r-none border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                  <option selected disabled>
                    Status
                  </option>
                  <option>All</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
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
              <Link
                to="/addIssueType"
                className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700"
              >
                Create IssueType
              </Link>
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Field Type
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{tbody}</tbody>
              </table>
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (issueTypeStatus === 'error') {
    content = <div>{error}</div>
  }

  return (
    <section className="issueTypes-list">
      {content}
      {(console.log('kaka1'), console.log(issueTypes), console.log('kaka2'))}
    </section>
  )
}
