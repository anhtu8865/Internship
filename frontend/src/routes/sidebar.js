/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: '/admin/user-manager', // the url
    icon: 'UserIcon', // the component being exported from icons/index.js
    name: 'User Manager', // name that appear in Sidebar
  },
  {
    path: '/admin/permission-manager',
    icon: 'PermissionIcon',
    name: 'Permission Project',
  },
  {
    path: '/admin/role-manager',
    icon: 'PeopleIcon',
    name: 'Role Manager',
  },
]

export default routes
