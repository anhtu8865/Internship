import NavbarButtonRight from './NavbarButtonRight'
import UserDropdown from './UserDropdown'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getMe,logout, inforUserSelector } from '../../slices/infouser'
import { useAppDispatch } from '../../store'
function Navbar() {
  const [isLogged, setIsLogged] = useState(false)
  const dispatch = useAppDispatch()
  const {inforUser, success, errorMessage, loading, hasErrors } =
      useSelector(inforUserSelector)
  useEffect(() => {
    setIsLogged(!!localStorage.getItem('accessToken'))
  })
useEffect(() => {
  if (isLogged) {
    dispatch(getMe())
  }
}, [isLogged])
 


  return (
    <>
      <header
        className="w-full h-full
      fixed top-0 z-50 flex items-center
    bg-alt-green max-h-14"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <ul className="flex flex-row my-auto items-center">
            <li>
              <Link to="/">
                <a
                  href
                  className="text-white ml-4 hover:text-yellow-300 cursor-pointer"
                >
                  Dashboards
                </a>
              </Link>
            </li>
            <li>
              <Link to="/projects">
                <a
                  href
                  className="text-white ml-4 hover:text-yellow-300 cursor-pointer"
                >
                  Projects
                </a>
              </Link>
            </li>

            {/* <li>
              <Link to="/issues">
                <a
                  href
                  className="text-white ml-4 hover:text-yellow-300 cursor-pointer"
                >
                  Issues
                </a>
              </Link>
            </li> */}
            <li>
              <Link
                to="/addIssue"
                className="bg-white border shadow-sm ml-4 px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700"
              >
                Create Issue
              </Link>
            </li>
            <div className="relative ml-5 text-gray-600 mr-4 lg:block hidden">
              <input
                className="border-2 border-gray-300 bg-white h-10 pl-2 pr-8 rounded-xl text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Search"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-3 mr-2"
              >
                <svg
                  className="text-gray-600 h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.966 56.966"
                  width="512px"
                  height="512px"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>
            </div>
          </ul>
          <div className="flex items-center px-4 space-x-2">
            {!isLogged && (
              <div>
                <Link to="/login">
                  <button className="text-white mx-4 text-sm hover:text-yellow-300 focus:outline-none bg-yellow-500 border px-4 py-1.5 rounded-md cursor-pointer">
                    LOGIN
                  </button>
                </Link>
              </div>
            )}
            <NavbarButtonRight
              svg={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="bevel"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
            />
            <NavbarButtonRight
              svg={
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              }
            />
            <NavbarButtonRight
              svg={
                <svg
                  className="w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              }
            />
            {/* Setting Button */}
            <UserDropdown isLogged={isLogged} />
          </div>
        </div>
      </header>
    </>
  )
}


export default Navbar
