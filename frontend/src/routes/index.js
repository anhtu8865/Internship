import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const UsersManager = lazy(() => import('../pages/UsersManager'))
const CreateUser = lazy(() => import('../pages/CreateUser'))
const PermissionManager = lazy(() => import('../pages/PermissionManager'))
const DetailPermission = lazy(() => import('../pages/DetailPermission'))
const RolesManager = lazy(() => import('../pages/RolesManager'))
const CreateRole = lazy(()=>import('../pages/CreateRole'))
const Projects = lazy(()=>import('../pages/Projects'))
const ProjectUsers = lazy(()=>import('../pages/ProjectUserRole'))
const TransitionItemForProject = lazy(()=>import('../pages/TransitionManagerForProject'))
import { Issues } from '../pages/Issues'
import { IssuesByProject } from '../pages/IssuesByProject'
import { Screens } from '../pages/Screens'
const WorkFlows = lazy(()=>import('../pages/Workflows'))
import { CustomFields } from '../pages/CustomFields'
import { IssueTypes } from '../pages/IssueTypes'
const Status = lazy(() => import('../pages/StatusManager'))
// const Modals = lazy(() => import('../pages/Modals'))
// const Tables = lazy(() => import('../pages/Tables'))
// // const Page404 = lazy(() => import('../pages/404'))
// const Blank = lazy(() => import('../pages/Blank'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/user-manager', // the url
    component: UsersManager, // view rendered
  },
  {
    path: '/user-manager/create-user',
    component: CreateUser,
  },
  {
    path: '/permission-manager',
    component: PermissionManager,
  },
  {
    path: '/permission-manager/detail-permission',
    component: DetailPermission,
  },
  {
    path: '/role-manager',
    component: RolesManager,
  },
  {
    path: '/role-manager/create-role',
    component: CreateRole,
  },
  {
    path: '/projects',
    component: Projects,
  },
  {
    path: '/project-user/:keyProject-:nameProject',
    component: ProjectUsers,
  },
  {
    path: '/transitionsforproject-manager',
    component: TransitionItemForProject,
  },
  {
    path: '/issues',
    component: Issues,
  },
  {
    path: '/IssuesByProject/:project',
    component: IssuesByProject,
  },
  {
    path: '/Screens',
    component: Screens,
  },
  {
    path: '/workflows-manager',
    component: WorkFlows,
  },
  {
    path: '/customFields',
    component: CustomFields,
  },
  {
    path: '/issueTypes',
    component: IssueTypes,
  },
  {
    path: '/status-manager',
    component: Status,
  },
]

export default routes
