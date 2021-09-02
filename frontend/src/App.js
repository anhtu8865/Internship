/* eslint-disable no-unused-vars */
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import CreateUser from './pages/CreateUser'
import Login from './pages/Login'
import React, { useState, useEffect, lazy } from 'react'
import Home from './pages/Home'
import Layout from './components/Layout'
import Projects from './pages/Projects'
import PermissionManager from './pages/PermissionManager';
import DetailPermission from './pages/DetailPermission';
import ProjectUserRole from './pages/ProjectUserRole';
import { Screens } from './pages/Screens'
import { UpdateScreenForm } from './components/Screen/UpdateScreenForm'
import { AddScreenForm } from './components/Screen/AddScreenForm'
import { CustomFields } from './pages/CustomFields'
import { IssueTypes } from './pages/IssueTypes'
import { Issues } from './pages/Issues'
import { IssuesByProject } from './pages/IssuesByProject'
import { UpdateCustomFieldForm } from './components/CustomField/UpdateCustomFieldForm'
import { AddCustomFieldForm } from './components/CustomField/AddCustomFieldForm'
import { AddIssueTypeForm } from './components/IssueType/AddIssueTypeForm'
import { AddIssueForm } from './components/Issue/AddIssueForm'
import { UpdateIssueForm } from './components/Issue/UpdateIssueForm'
import { UpdateIssueTypeForm } from './components/IssueType/UpdateIssueTypeForm'
import Users from './pages/UsersManager'
import Roles from './pages/RolesManager'
import CreateRole from './pages/CreateRole'
import { ScreenCustomFields } from './pages/ScreenCustomFields'
import { ProjectIssueTypeScreens } from './pages/ProjectIssueTypeScreens'
import Workflows from './pages/Workflows';
import CreateWorkflow from './pages/CreateWorkflow';
// import CreateTransition from './pages/CreateTransition';
import AddWorkflow from './pages/AddWorkflow';
import CreateStatus from './pages/CreateStatus';
import Statuss from './pages/StatusManager';
import Transition from './pages/TransitionManager';
import AddTransition from './pages/AddTransition';
import UpdateWorkflowModal from './pages/UpdateWorkflow';
import Profile from './pages/Profile'
import TransitionItemForProject from './pages/TransitionManagerForProject'
import { ToastProvider } from 'react-toast-notifications';
const Layout2 = lazy(() => import('./containers/Layout'))

function App() {
  return (
    <ToastProvider
      //autoDismiss
      autoDismissTimeout={3000}
      // components={{ Toast: Snack }}
      // placement="bottom-center"
    >
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Redirect exact from="/" to="/login" />
          <Route path="/app" component={Layout2} />
          {/* <Layout> */}
          {/* <Route path="admin/create-user">
              <CreateUser />
            </Route> */}
          {/* <Route path="/create-roles">
              <CreateRole />
            </Route> */}
          {/* <Route path="/projects">
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
            <Route path="/transitionsforproject-manager">
              <TransitionItemForProject></TransitionItemForProject>
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
            </Route> */}
          {/* <Route path="/create-transitions">
            <CreateTransition />
          </Route> */}
          {/* <Route path="/screens">
              <Screens />
            </Route>
            <Route path="/addScreen">
              <AddScreenForm />
            </Route>

            <Route
              exact
              path="/editScreen/:screenId"
              component={UpdateScreenForm}
            />
            <Route
              exact
              path="/screenCustomFields/:screenId"
              component={ScreenCustomFields}
            />
            <Route
              exact
              path="/projectIssueTypeScreens/:issueTypeId"
              component={ProjectIssueTypeScreens}
            />

            <Route path="/customFields">
              <CustomFields />
            </Route>
            <Route path="/addCustomField">
              <AddCustomFieldForm />
            </Route>

            <Route
              exact
              path="/editCustomField/:customFieldId"
              component={UpdateCustomFieldForm}
            />
            <Route path="/issueTypes">
              <IssueTypes />
            </Route>
            <Route path="app/issues">
              <Issues />
            </Route>
            <Route path="/addIssueType">
              <AddIssueTypeForm />
            </Route>
            <Route path="/addIssue">
              <AddIssueForm />
            </Route>
            <Route
              exact
              path="/editIssueType/:issueTypeId"
              component={UpdateIssueTypeForm}
            />

            <Route
              exact
              path="/editIssue/:issueId"
              component={UpdateIssueForm}
            />
            <Route
              exact
              path="/IssuesByProject/:project"
              component={IssuesByProject}
            /> */}

          {/* <Route path="/roles-manager">
              <Roles></Roles>
            </Route> */}
          {/* <Route path="/permission-manager">
              <PermissionManager></PermissionManager>
            </Route>
            <Route path="/detail-permission">
              <DetailPermission></DetailPermission>
            </Route> */}
          {/* <Route path="/project-user/:keyProject-:nameProject">
              <ProjectUserRole></ProjectUserRole>
            </Route> */}
          {/* <Route path="/">
              <Home />
            </Route>
            <Route path="/profile">
              <Profile></Profile>
            </Route> */}
          {/* </Layout> */}
        </Switch>
      </Router>
    </ToastProvider>
  )
}

export default App
