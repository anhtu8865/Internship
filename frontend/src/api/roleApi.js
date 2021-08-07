import axiosClient from './axiosClient'

const roleApi = {
  getAllRole: () => axiosClient.get("/roles/"),
  delete: (id) => axiosClient.delete("/roles?id=" + id),
  createRole: (data) => axiosClient.post("/roles",data),
  updateRole:({id,data}) => axiosClient.put("/roles?id="+id,data)
    // login: (body) => axiosClient.post(url, body),
    // create: (data) => axiosClient.post(urlCreateuser, data),
    // update: ({id, data}) => axiosClient.put("/users/admin/update-user?id=" + id, data),
    // delete: (id) => axiosClient.delete("users/delete-user?id=" + id),
   //http://localhost:5001/api/roles?id=102
    // getMe = async (payload) => {
    //   const url = '/me';
    //   const response = await axiosClient.get(url, payload);
    //   return response.data;
    // }
  }
  export default roleApi
