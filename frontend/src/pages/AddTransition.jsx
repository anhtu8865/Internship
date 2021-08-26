import FormInput from "../components/Form/FormInput";
import { useForm } from "react-hook-form";
import TransitionApi from "../api/transitionApi";
import { useHistory } from 'react-router-dom'
import React from 'react'
import Select from 'react-select'
// import { useAppDispatch } from '../store'
// import { createTransition } from "../slices/Transitions";

export default function CreateTransition(modalDialog) {
    const {fulldata} = modalDialog
    let temp = JSON.parse(localStorage.getItem('Status') || '[]' )
    let temp1 = JSON.parse(localStorage.getItem('Workflow') || '[]' )
    console.log(temp)
    const{register,handleSubmit} = useForm();
    const history = useHistory()
    const onSubmit = data => {
        console.log(data)
        if(data.Status1Id == data.Status2Id){
          alert("Not Success")
          alert("STATUS1 must be different from STATUS2")
        }
        else{
        let statusname1
        let statusname2
        temp.map((temp) => {
            console.log(temp)
          if (temp.StatusId == data.Status1Id) {
            statusname1 = temp.StatusName
          }
        })
        temp.map((temp) => {
          console.log(temp)
        if (temp.StatusId == data.Status2Id) {
          statusname2 = temp.StatusName
        }
      })
        console.log(statusname1)
        console.log('kkkkk')
        const postData = {
            Status1Id: data.Status1Id,
            Status2Id: data.Status2Id,
            Status1Name: statusname1,
            Status2Name: statusname2,
            TransitionName: data.TransitionName,
            WorkflowId: data.WorkflowId,
        }
        console.log(postData)
        TransitionApi.createTransition(postData).then(()=>{
            alert('Create Transition Success')
            history.push('/transitions-manager')
        }).catch(err => alert(err))
      }
    }

    var option1s = temp.map((option) => {
        return (
          <option key={option.Status1Id} value={option.StatusId}>
            {option.StatusName}
          </option>
        )
      })
      console.log(option1s)
      const fil = temp.filter(
        (item1) => !temp.some((item2) => item1.Status1Id === item2.StatusId)
      )
      console.log(fil)
      var option2s = fil.map((option) => {
        return (
          <option key={option.Status2Id} value={option.StatusId}>
            {option.StatusName}
          </option>
        )
      })
    
       
    
  
    // const history = useHistory()
    //  const dispatch = useAppDispatch()
    //  const{register,handleSubmit} = useForm();
    //  const onSubmit = data => {
    //     console.log(data)
    //     dispatch(createTransition(data))
    //     history.push('/Transitions-manager')
    // }


    return (
       <div className="w-full h-full pt-16">
      <div className="max-w-xl px-8 py-8 border-0 shadow-lg rounded-xl h-auto bg-white mx-auto">
        <h1 className="text-2xl font-bold pb-8">Create Transition</h1>
        <hr className="mb-5"/>
        <div className="px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput r={register} name="WorkflowId" label='Workflow ID'  required  value= {temp1.WorkflowId} />
          <FormInput r={register} name="TransitionName" label='Transition Name' required />
          {/* <FormInput r={register} name="Status1Id" label='Status'  />  */}
          {/* <Select option= {temp}/>  */}
          Status 1           :
          <select
                className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('Status1Id')}
              >
                {option1s}
              </select>

              Status 2            :
              <select
                className="py-2 px-3 rounded-md border border-green-500 mt-2 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-transparent"
                {...register('Status2Id')}
              >
                {option2s}
              </select>
          <div className="w-full mt-10 mb-5 px-10">
            <input type="submit" value="Create Transition" className="bg-green-600 rounded-md py-2 
            text-white text-xl w-full" />
          </div>
          </form>
        </div>
      </div>
    </div>
    )
}
