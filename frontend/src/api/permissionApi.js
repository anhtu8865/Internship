import axiosClient from './axiosClient'

const permissionApi = {
    getAllPermission: () => axiosClient.get("permission/"),
    getPrmissionRole: (id) => axiosClient.get("permission/permission-role?id="+id)
}
export default permissionApi