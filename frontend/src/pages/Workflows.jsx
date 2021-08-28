import React, { useEffect } from 'react'
import { fetchWorkflows,workflowsSelector,setState } from '../slices/workflows'
import { fetchWorkflowProjects,workflowProjectsSelector } from '../slices/wor-pro'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import WorkflowItem from '../components/Workflow/WorkflowItem'
import { Link } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import {Button} from '@windmill/react-ui'
 const WorkflowManager= () => {
    const { addToast } = useToasts()
    const dispatch = useAppDispatch()
    const { updateWor, updateSuccess,workflows,loading, hasErrors } = useSelector(workflowsSelector)
   
   useEffect(() => {
        dispatch(fetchWorkflows()) 
    }, [dispatch])
    useEffect(() => {
           if (updateSuccess) {
             addToast("Edit Success", {
               appearance: 'success',
               autoDismiss: true,
             })
             dispatch(setState())
           }
         }, [updateSuccess])
    const renderWorkflow = () =>{
      console.log(workflows)
        return workflows.map((workflow)=>
            <WorkflowItem key={workflow.WorkflowId} workflow={workflow} />
        )
    }
    if (loading) {
      return (
        <tr>
          <div className="loader">Loading...</div>
        </tr>
      )
    }
    if (hasErrors) return <p>Unable to get Workflow.</p>
    return (
        <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Workflow</h2>
          </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
          <div className="flex">
            <Link to="/add-workflows">
            <Button size="large">Create Workflow</Button>
            </Link>
            {/* <Link to="/invite-user">
              <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700 ml-1">
                Invite Users
              </button>
            </Link> */}
          </div>
        </div>
          <div className="my-2 flex justify-between sm:flex-row flex-col">
            <div className="flex">
              {/* <Link to="/create-projects">
                <button className="bg-white border shadow-sm px-3 py-1.5 rounded-md hover:text-green-500 text-gray-700">
                  Create project
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
                      Name Workflow
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project
                    </th>
                    {/* <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Group name
                    </th> */}
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                       Action
                    </th>
                  </tr>
                </thead>
                <tbody>{renderWorkflow()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
}
export default WorkflowManager