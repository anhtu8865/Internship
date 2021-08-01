import FormInput from "../components/Form/FormInput";
import React from "react";
import { useForm } from "react-hook-form";
import userApi from "../api/userApi";

function CreateUser() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    userApi.create(data).then(() => {
      alert('Create User Success')
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
          <FormInput r={register} name="user" label='Username' required />
          <FormInput r={register} name="email" label='Email' required />
          <FormInput r={register} name="password" label='Password' required />
          <div className="w-full mt-10 mb-5 px-10">
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