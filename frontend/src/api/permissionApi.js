import axiosClient from './axiosClient'

const permissionApi = {
    getAll: ()=> axiosClient.get("permission"),
}
export default permissionApi