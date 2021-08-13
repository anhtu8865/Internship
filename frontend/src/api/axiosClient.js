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
  const { code } = response.data
  console.log(code)
  if (response && response.data) {
   
    return response.data;
  }
  return response;
}, (error) => {
  if (error.response.data.Msg == "Token expired, please login again")
  {
    const refresh_token = localStorage.getItem('refreshToken')
    console.log(refresh_token)
    const data = {
      refresh_token: refresh_token,
    }
    if (refresh_token) {
      console.log("oke")
      userApi
        .refresh(data)
        .then((response) => {
          localStorage.setItem('accessToken', response.access_token)
          localStorage.setItem('refreshToken', response.refresh_token)
        })
        .catch((err) => alert(err))
    } 
  }
  // Handle errors
  throw error;
});
export default axiosClient;