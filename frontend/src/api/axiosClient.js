// api/axiosClient.js
import axios from 'axios';
import queryString from 'query-string';
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
    console.log("have accesstoken")
    console.log(accessToken)
    // customHeaders.Authorization = accessToken;
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
  // Handle errors
  throw error;
});
export default axiosClient;