import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom"



function SettingDropdown({isLogged}) {
  const [setting, setProfile] = useState(false)
  console.log(setting)
  const history = useHistory()

  function SigOut(){
    localStorage.removeItem("accessToken")
    history.push('/login')
  }
  
  return (
    <div className="flex items-center relative cursor-pointer" onClick={() => setProfile(!setting)}>
      <div className="rounded-full">
          {setting ? (
              <ul className="p-2 w-full min-w-max border-r bg-white absolute rounded -top-1 right-0 shadow mt-12 sm:mt-16 ">
                <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center">
                  <div className="flex items-center">
                  <svg className="" width={18} height={18} focusable="false" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z">
                  </path></svg>
                      <Link to="/user-manager">
                        <span className="text-sm ml-2">User Management</span>
                      </Link>
                  </div>
                </li>
                <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center">
                  <div className="flex items-center">
                  <svg className="" width={18} height={18} focusable="false" viewBox="0 0 24 24" strokeWidth="1.5" aria-hidden="true">
                  <path d="M16.5 13c-1.2 0-3.07.34-4.5 1-1.43-.67-3.3-1-4.5-1C5.33 13 1 14.08 1 16.25V19h22v-2.75c0-2.17-4.33-3.25-6.5-3.25zm-4 4.5h-10v-1.25c0-.54 2.56-1.75 5-1.75s5 1.21 5 1.75v1.25zm9 0H14v-1.25c0-.46-.2-.86-.52-1.22.88-.3 1.96-.53 3.02-.53 2.44 0 5 1.21 5 1.75v1.25zM7.5 12c1.93 0 3.5-1.57 3.5-3.5S9.43 5 7.5 5 4 6.57 4 8.5 5.57 12 7.5 12zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 5.5c1.93 0 3.5-1.57 3.5-3.5S18.43 5 16.5 5 13 6.57 13 8.5s1.57 3.5 3.5 3.5zm0-5.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z">
                  </path></svg>
                      <Link to="/roles-manager">
                        <span className="text-sm ml-2">Project Role Management</span>
                      </Link>
                  </div>
                </li>
                <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user" width={18} height={18} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <circle cx={12} cy={7} r={4} />
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        </svg>
                        <span className="text-sm ml-2">My Profile</span>
                    </div>
                  </li>
                  <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2">
                      <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width={18} height={18} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" />
                              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                              <path d="M7 12h14l-3 -3m0 6l3 -3" />
                          </svg>
                          <span className="text-sm ml-2" onClick={SigOut}>Sign out</span>
                      </div>
                  </li>
              </ul>
          ) : (
              ""
          )}
          {isLogged && (
              <button className="p-px border-2 border-green-100 rounded-full w-10 h-10">
                <img
                  className="block object-cover rounded-full"
                  src="https://avatars0.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4"
                  alt="Ahmed Kamel"
                />
              </button>
            )}
      </div>
    </div>
  )
}

export default SettingDropdown