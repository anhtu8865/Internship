/* eslint-disable no-unused-vars */
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import CreateUser from "./pages/CreateUser"
import Login from "./pages/Login"
import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import Layout from "./components/Layout"
import Projects from './pages/Projects'

import {Screens} from './pages/Screens';
import { UpdateScreenForm} from './components/Screen/UpdateScreenForm'
import { AddScreenForm} from './components/Screen/AddScreenForm'
import {CustomFields} from './pages/CustomFields';
import { UpdateCustomFieldForm} from './components/CustomField/UpdateCustomFieldForm'
import { AddCustomFieldForm} from './components/CustomField/AddCustomFieldForm'
import Users from './pages/UsersManager';
import Roles from './pages/RolesManager';
import CreateRole from "./pages/CreateRole";
import Workflows from './pages/Workflows';
import CreateWorkflow from './pages/CreateWorkflow';
import CreateTransition from './pages/CreateTransition';
import AddWorkflow from './pages/AddWorkflow';
import CreateStatus from './pages/CreateStatus';
import Statuss from './pages/StatusManager';
import Transition from './pages/TransitionManager';
import AddTransition from './pages/AddTransition';
import UpdateWorkflowModal from './pages/UpdateWorkflow';
function App() {
 

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
          <Route path="/update-workflows">
            <UpdateWorkflowModal></UpdateWorkflowModal>
          </Route>
         
          <Route path="/create-workflows">
            <CreateWorkflow />
          </Route>
          <Route path="/workflows-manager">
            <Workflows></Workflows>
          </Route>
          <Route path="/add-workflows">
            <AddWorkflow></AddWorkflow>
          </Route>
        
          <Route path="/add-transitions">
            <AddTransition></AddTransition>
          </Route>
          
          
          <Route path="/statuss-manager">
            <Statuss></Statuss>
          </Route>
          <Route path="/transitions-manager">
            <Transition></Transition>
          </Route>
          <Route path="/create-statuss">
            <CreateStatus></CreateStatus>
          </Route>
          <Route path="/create-transitions">
            <CreateTransition />
          </Route>
          <Route path="/screens">
            <Screens />
          </Route>
          <Route path="/addScreen">
            <AddScreenForm />
          </Route>
          <Route exact path="/editScreen/:screenId" component={UpdateScreenForm} />


          <Route path="/customFields">
            <CustomFields />
          </Route>
          <Route path="/addCustomField">
            <AddCustomFieldForm />
          </Route>
          <Route exact path="/editCustomField/:customFieldId" component={UpdateCustomFieldForm} />


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
