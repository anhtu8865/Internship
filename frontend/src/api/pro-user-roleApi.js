import axiosClient from './axiosClient'

const ProjectUserRoleApi = {
  getAllUserRoleInProject: (key) => axiosClient.get('/project-user-role?key='+key),
}
export default ProjectUserRoleApi