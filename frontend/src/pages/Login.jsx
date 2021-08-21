import FormInput from "../components/Form/FormInput";
import React from "react";
import { useForm } from "react-hook-form";
import userApi from "../api/userApi";
import Cookies from "universal-cookie";
const cookies = new Cookies()
function Login(props) {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    userApi.login(data).then(async (response) => {
      if(response.Msg == "Login Success")
      {
      localStorage.setItem("accessToken", response.Data.access_token)
      localStorage.setItem('refreshToken', response.Data.refresh_token)
      props.history.push('/')
      }
      else{
        alert(response.Msg)
      }
    }).catch(err => alert(err))
  };

  return (
    <div className="w-full h-full pt-32">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Login </h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="username" label='Username' required />
          <FormInput r={register} name="password" label='Password' type="password" required />
          <div className="w-full mt-10 mb-5 px-10">
            <input type="submit" value="Login" className="bg-green-600 rounded-md py-2 cursor-pointer
            text-white text-xl w-full" />
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login