import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  fetchTransitionStatuss,
  transitionStatussSelector,
} from '../../slices/tra-sta'
import { useHistory } from 'react-router-dom'
import { setTransitionUpdate } from '../../slices/transition'
import transitionApi from '../../api/transitionApi'
import { deleteTransition } from '../../slices/transition'
import { useToasts } from 'react-toast-notifications'
const TransitionItem = ({ transition }) => {
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()
  const history = useHistory()

  const [transitionstatuss_temp, setResult] = useState([])
  useEffect(() => {
    if (transition) {
      // transitionApi.getTransitionStatus(transition.TransitionId).then((data) => {
      //   console.log(data.Data)
      //   setResult(data.Data)
      axios({
        method: 'get',
        url: 'http://localhost:5001/api/transition/transition-status?id=' + transition.TransitionId,
        responseType: 'stream'
      })
        .then(function (response) {
          console.log(response)
          setResult(response.data.Data)
        });
      
    }
  }, [])

  //get transition to detail
  const handleOpenUpdate = (e, transition) => {
    e.preventDefault()
    dispatch(setTransitionUpdate(transition))
    history.push('/create-transitions')
  }
  const handleOpenTransition = (e, transition) => {
    e.preventDefault()
    
    history.push('/transitions-manager')
  }

  const renderTransitionStatus = () => {
    if (transitionstatuss_temp != null) {
      console.log(transitionstatuss_temp)
      return transitionstatuss_temp.map((temp) => (
        <li key={temp.StatusId}>{temp.StatusName}</li>
      ))
    } else {
      return <li></li>
    }
  }
  function deleteConfirm(e, TransitionId) {
    e.preventDefault()
    if (confirm('Delete?')) {

      dispatch(deleteTransition(TransitionId))
      addToast("Delete Transition Success", {
        appearance: 'success',
        autoDismiss: true,
      })
    }
  }
  return (
    <>
      {/* <StatusModal modalDialog={modalUpdate} /> */}
      <tr key={transition.TransitionId}>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                <Link to="#">
                  <a className="text-black-400 whitespace-no-wrap">
                    {transition.TransitionName} 
                    
                  </a>
                  <a className="text-red-400 whitespace-no-wrap">
                    ({transition.TransitionId})
                    
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <a className="text-blue-400 whitespace-no-wrap">
              {transition.Status1Name}
            </a>
          </Link>
        </td>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <Link to="#">
            <ul className="text-blue-400 whitespace-no-wrap">
              {transition.Status2Name}
            </ul>
          </Link>
        </td>

        <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
          {/* <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => handleOpenUpdate(e, transition)}
              className="relative cursor-pointer"
            >
              Add Status
            </a>
          </span> */}
          
          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span
              aria-hidden
              className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
            />
            <a
              onClick={(e) => deleteConfirm(e, transition.TransitionId)}
              className="relative cursor-pointer"
            >
              Delete
            </a>
          </span>
          {/* <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
                />
                <a
                  // onClick={(e) => deleteConfirm(e,status.Status_Id)}
                  className="relative cursor-pointer text-red-900"
                >
                  Delete
                </a>
              </span> */}
        </td>
      </tr>
    </>
  )
}

export default TransitionItem
