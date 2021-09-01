import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const UsersManager = lazy(() => import('../pages/UsersManager'))
const CreateUser = lazy(() => import('../pages/CreateUser'))
const PermissionManager = lazy(() => import('../pages/PermissionManager'))
const DetailPermission = lazy(() => import('../pages/DetailPermission'))
const RolesManager = lazy(() => import('../pages/RolesManager'))
const CreateRole = lazy(()=>import('../pages/CreateRole'))
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
    path: '/permission-manager',
    component: PermissionManager,
  },
  {
    path: '/role-manager',
    component: RolesManager,
  },{
    path:'/role-manager/create-role',
    component:CreateRole
  },
  {
    path: '/user-manager/create-user',
    component: CreateUser,
  },
  {
    path: '/permission-manager/detail-permission',
    component:DetailPermission
  },
]

export default routes
