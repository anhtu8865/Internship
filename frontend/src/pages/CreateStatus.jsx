import FormInput from "../components/Form/FormInput";
import { useForm } from "react-hook-form";
import statusApi from "../api/statusApi";
import { useHistory } from 'react-router-dom'
import React from 'react'
// import { useAppDispatch } from '../store'
// import { createStatus } from "../slices/statuss";

export default function CreateStatus() {
    const{register,handleSubmit} = useForm();
    const history = useHistory()
    const onSubmit = data => {
        console.log(data)
        statusApi.createStatus(data).then(()=>{
            alert('Create Status Success')
            history.push('/statuss-manager')
        }).catch(err => alert(err))
    }
    // const history = useHistory()
    //  const dispatch = useAppDispatch()
    //  const{register,handleSubmit} = useForm();
    //  const onSubmit = data => {
    //     console.log(data)
    //     dispatch(createStatus(data))
    //     history.push('/statuss-manager')
    // }


    return (
       <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create Project Status</h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="StatusName" label='Status Name' required />
          <FormInput r={register} name="StatusDescription" label='Description'  /> 
          <div className="w-full mt-10 mb-5 px-10">
            <input type="submit" value="Create Status" className="bg-green-600 rounded-md py-2 
            text-white text-xl w-full" />
          </div>
          </form>
        </div>
      </div>
    </div>
    )
}
