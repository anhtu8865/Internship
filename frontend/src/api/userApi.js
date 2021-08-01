import axiosClient from './axiosClient'

const url = 'users/'

const userApi = {
  getAll: () => axiosClient.get(url),
  login: (body) => axiosClient.post(url, body),
  create: (data) => axiosClient.put(url, data),
  update: ({id, data}) => axiosClient.put(url + id, data),
  delete: (id) => axiosClient.delete(url + id),

  // getMe = async (payload) => {
  //   const url = '/me';
  //   const response = await axiosClient.get(url, payload);
  //   return response.data;
  // }
}

export default userApi
