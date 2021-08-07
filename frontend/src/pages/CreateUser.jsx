import FormInput from "../components/Form/FormInput";
import React from "react";
import { useForm } from "react-hook-form";
import userApi from "../api/userApi";
import { useHistory } from 'react-router-dom'

function CreateUser() {
  const { register, handleSubmit } = useForm();
  const history = useHistory()
 const onSubmit = data => {
    userApi.create(data).then(() => {
      alert('Create User Success')
      history.push('/user-manager')
    }).catch(err => alert(err))
  };

  return (
    <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create New User</h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="fullname" label='Full name' required />
          <FormInput r={register} name="username" label='Username' required />
          <FormInput r={register} name="email" label='Email' required />
          <FormInput r={register} name="password" label='Password' required />
          <div className="grid grid-cols-1 my-4">
              <label className="uppercase md:text-sm text-xs text-gray-500 text-light">
                Global Role
              </label>
              <select  className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
              {...register("globalrole")}
              >
                <option value="0">Admin</option>
                <option value="1">Trusted</option>
                <option value="2">Member</option>

              </select>
            </div>          <div className="w-full mt-10 mb-5 px-10">
            <input type="submit" value="Create User" className="bg-green-600 rounded-md py-2 
            text-white text-xl w-full" />
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateUser