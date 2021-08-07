/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import CreateUser from "./pages/CreateUser"
import Login from "./pages/Login"
import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import Layout from "./components/Layout"
import Projects from './pages/Projects'
import Users from './pages/UsersManager';
import Roles from './pages/RolesManager';
import CreateRole from "./pages/CreateRole"
function App() {
  // const [isLogged, setIsLogged] = useState(false)
  // useEffect(() => {
  //   setIsLogged(!!localStorage.getItem('accessToken'))
  // })

  return (
    <Router>
      <Switch>
        <Layout>      
        <Route path="/login" component={Login} />
          <Route path="/create-user">
            <CreateUser />
          </Route>
          <Route path="/create-roles">
            <CreateRole />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/user-manager">
            <Users></Users>
          </Route>
          <Route path="/roles-manager">
            <Roles></Roles>
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Layout>
      </Switch>
    </Router>
  );
}

export default App;
