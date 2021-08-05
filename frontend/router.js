/* eslint-disable no-unused-vars */
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import React, { useState, useEffect } from 'react'
import Home from './pages/Home'
import Layout from './components/Layout'
import Projects from './pages/Projects'


function router() {
  // const [isLogged, setIsLogged] = useState(false)
  // useEffect(() => {
  //   setIsLogged(!!localStorage.getItem('accessToken'))
  // })

  return (
    <Router>
      <Switch>
        <Route>
          <Layout>
            <Route path="/login" component={Login} />
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/create-user">
              <CreateUser />
            </Route>
            <Route path="/projects">
              <Projects />
            </Route>
          </Layout>
        </Route>
      </Switch>
    </Router>
  )
}

export default router
