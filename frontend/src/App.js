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
import {IssueTypes} from './pages/IssueTypes';
import { UpdateCustomFieldForm} from './components/CustomField/UpdateCustomFieldForm'
import { AddCustomFieldForm} from './components/CustomField/AddCustomFieldForm'
import { AddIssueTypeForm} from './components/IssueType/AddIssueTypeForm'
import { UpdateIssueTypeForm} from './components/IssueType/UpdateIssueTypeForm'
import Users from './pages/UsersManager';
import Roles from './pages/RolesManager';
import CreateRole from "./pages/CreateRole"
import { ScreenCustomFields } from './pages/ScreenCustomFields';

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
          <Route path="/screens">
            <Screens />
          </Route>
          <Route path="/addScreen">
            <AddScreenForm />
          </Route>
          <Route exact path="/editScreen/:screenId" component={UpdateScreenForm} />
          <Route exact path="/screenCustomFields/:screenId" component={ScreenCustomFields} />
          <Route path="/customFields">
            <CustomFields />
          </Route>
          <Route path="/addCustomField">
            <AddCustomFieldForm />
          </Route>
          <Route exact path="/editCustomField/:customFieldId" component={UpdateCustomFieldForm} />
          <Route path="/issueTypes">
            <IssueTypes />
          </Route>
          <Route path="/addIssueType">
            <AddIssueTypeForm />
          </Route>
          <Route exact path="/editIssueType/:issueTypeId" component={UpdateIssueTypeForm} />
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
