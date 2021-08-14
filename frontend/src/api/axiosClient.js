// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
import userApi from './userApi';
import { useHistory } from 'react-router-dom'

// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  // const customHeaders = {};
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken
  }
  else{
    console.log("not have accesstoken")
  }
  return config;
})
axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => { 
    if (error.response.data.Msg == 'Token expired, please login again' && error.config.url != '/users/logout') {
      const refresh_token = localStorage.getItem('refreshToken')
      const data = {
        refresh_token: refresh_token,
      }
      if (refresh_token) {
        userApi.refresh(data).then((response) => {
          const accessToken = response.access_token
          localStorage.setItem('accessToken', response.access_token)
          localStorage.setItem('refreshToken', response.refresh_token)
          const config = error.config
          config.headers['Authorization'] = `Bearer ${accessToken}`
          console.log("oke1")
          return new Promise((resolve, reject) => {
            axios
              .request(config)
              .then((res) => {
                console.log('lấy data hết hạn ')
                console.log(res.data.Data)
                resolve(res.data.Data)
              })
              .catch((err) => {
                console.log(err)
                reject(err)
              })
          })
        })
      }
    }
  // Handle errors
});
export default axiosClient;