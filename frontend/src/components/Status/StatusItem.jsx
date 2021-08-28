import React from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { deleteStatus,setStatusUpdate} from '../../slices/statuss'
import StatusModal from './UpdateStatusModal';
import { TableCell, TableRow, Button } from '@windmill/react-ui'
import { useToasts } from 'react-toast-notifications'

const StatusItem = ({ status }) => {
  const {addToast} = useToasts()
  const dispatch = useAppDispatch()

  function deleteConfirm(e, statusId) {
    e.preventDefault()
    if (confirm('Delete?')) {
      dispatch(deleteStatus(statusId))
      // addToast("Delete Status Success", {
      //   appearance: 'success',
      //   autoDismiss: true,
      // })
    }
  }

  const [openUpdate, setOpenUpdate] = React.useState(false)

  const handleOpenUpdate = (e, status) => {
    e.preventDefault()
    dispatch(setStatusUpdate(status))
    setOpenUpdate(true)
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false)
  }
  const modalUpdate = {
    open: openUpdate,
    handleOpen: handleOpenUpdate,
    handleClose: handleCloseUpdate,
  }


  return (
    <>
      <StatusModal modalDialog={modalUpdate} />
      <TableRow key={status.StatusId}>
            <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div className="flex items-center">
                
                <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">
                    <Link to="#">
                      <a className="text-blue-400 whitespace-no-wrap">
                        {status.StatusName}
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {status.StatusDescription}
                </a>
              </Link>
            </TableCell>
           
            <TableCell className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
              <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                />
                <a
                onClick={(e) => handleOpenUpdate(e, status)} 
                className="relative cursor-pointer">Edit</a>
              </span>
              <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
                />
                <a
                  onClick={(e) => deleteConfirm(e,status.StatusId)}
                  className="relative cursor-pointer text-red-900"
                >
                  Delete
                </a>
              </span>
            </TableCell>
          </TableRow>
    </>
  )
}

export default StatusItem
