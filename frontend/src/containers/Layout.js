import React, { useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'

import Sidebar from '../components/Sidebar'
import Header2 from '../components/Header2'
import Main from '../containers/Main'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'

 const Page404 = lazy(() => import('../pages/404'))

function Layout() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  let location = useLocation()

  useEffect(() => {
    closeSidebar()
  }, [location])

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && 'overflow-hidden'
      }`}
    >
      <div className="flex flex-col flex-1 w-full">
        <Header2 />
        <div className="flex">
          <Sidebar />
          <div className="w-full">
            <Suspense fallback={<ThemedSuspense />}>
              <Switch>
                {routes.map((route, i) => {
                  return route.component ? (
                    <Route
                      key={i}
                      exact={true}
                      path={`/app${route.path}`}
                      render={(props) => <route.component {...props} />}
                    />
                  ) : null
                })}
                <Redirect exact from="/app" to="/app/projects" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
