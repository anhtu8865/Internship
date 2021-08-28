import React, { useEffect, useState } from 'react'
import { fetchTransitions,getDataByIdWorkflow,transitionsSelector } from '../slices/transition'
import { fetchTransitionStatuss,transitionStatussSelector } from '../slices/tra-sta'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import TransitionItem from '../components/Transition/TransitionItem'
import { Link } from 'react-router-dom'
import { workflowsSelector } from '../slices/workflows'
import { projectsSelector } from '../slices/projects'
import TransitionItemForProject from '../components/Transition/TransitionItemForProject'
import workflowApi from '../api/workflowApi' 
import axios from 'axios'
import { getDataNameByIdWorkflow } from '../slices/workflows'

const  TransitionManagerForProject= (project) => {

  const {workflowUpdate} = useSelector(workflowsSelector)

    localStorage.setItem('Project', JSON.stringify(workflowUpdate))
  
  let temp = JSON.parse(localStorage.getItem('Project') || '[]' )
  console.log(temp)
  
  const [fullData, setResult] = useState({})
  useEffect( () => {
  
      // transitionApi.getTransitionStatus(transition.TransitionId).then((data) => {
      //   console.log(data.Data)
      //   setResult(data.Data)
      console.log("kkkk")      
      const axiosGet = async() => axios({
        method: 'get',
        url: 'http://localhost:5001/api/workflows?id=' + temp.WorkflowId,
        responseType: 'stream'
      })
        .then(function (response) {
          
          if(response.data.Data)
          setResult(response.data.Data[0])
        });
      
        axiosGet();
  }, [])  
    
    const dispatch = useAppDispatch()
    const { transitions,loading, hasErrors } = useSelector(transitionsSelector)
   useEffect(() => {
    
    dispatch(getDataByIdWorkflow(temp.WorkflowId)) 
    }, [dispatch])

    const renderTransition = () =>
       {    if(transitions)
            return transitions.map((transition)=>
            <TransitionItemForProject key={transition.TransitionId} transition={transition} />
        )
        else return <div>NULL</div>
    }
    const dispatch1 = useAppDispatch()
    const{worklfows, loading1, hasErrors1} = useSelector(workflowsSelector)
    useEffect(() => {
      dispatch1(getDataNameByIdWorkflow(temp.WorkflowId))
    }, [dispatch1])
    console.log(worklfows)
 
  
  
    if (loading) {
      return (
        <tr>
          <div className="loader">Loading...</div>
        </tr>
      )
    }

    if (hasErrors) return <p>Unable to get Transition.</p>
    return (
        <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
        <div>
            <h1 className="text-2xl font-semibold leading-tight">{fullData.WorkflowName}</h1>
            
          </div>
          <div>
            <h2 className="text-2xl font-semibold leading-tight"> {fullData.WorkflowDescription}</h2>
            
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex">
            
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button>
            </Link> */}
          </div>
        </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
              {/* <Link to="/create-statuss">
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                  Create status
                </button>
              </Link> */}
              {/* <Link to="/invite-user">
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                  Invite Users
                </button>
              </Link> */}
            </div>
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name Transition (ID)
                    </th>
                    
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status 1
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status 2
                    </th>
                   
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Group name
                    </th> */}
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {/* Action */}
                    </th>
                  </tr>
                </thead>
                <tbody>{renderTransition()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}
export default TransitionManagerForProject