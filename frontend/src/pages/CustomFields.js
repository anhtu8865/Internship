import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllCustomFields,
  fetchCustomFields,
  deleteCustomField,
  setErrorNull,
  setSuccessNull,
} from '../slices/customFields'
import { useToasts } from 'react-toast-notifications'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@windmill/react-ui'
import { AddCustomFieldForm } from '../components/CustomField/AddCustomFieldForm'
import { UpdateCustomFieldForm } from '../components/CustomField/UpdateCustomFieldForm'

const CustomFieldExcerpt = ({ customField, openModal }) => {
  return (
    <tr key={customField.Id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {customField.Name}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {customField.Field_Type}
        </p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {customField.Description}
        </p>
      </td>
      <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <UpdateCustomFieldForm customFieldId={customField.Id} />
        </span>
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          />
          <a
            onClick={() => openModal(customField.Id)}
            className="relative cursor-pointer text-red-900"
          >
            Delete
          </a>
        </span>
      </td>
    </tr>
  )
}

export const CustomFields = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const customFields = useSelector(selectAllCustomFields)

  const customFieldStatus = useSelector((state) => state.customFields.status)
  const error = useSelector((state) => state.customFields.error)
  const success = useSelector((state) => state.customFields.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  useEffect(() => {
    if (customFieldStatus === 'idle') {
      dispatch(fetchCustomFields())
    }
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
      dispatch(setErrorNull({ error: null }))
    }
    if (success) {
      addToast(success, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setSuccessNull({ success: null }))
    }
  }, [customFieldStatus, dispatch, error, success])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteCustomField({ Id }))
    closeModal()
  }
  let content

  if (customFieldStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (customFieldStatus === 'succeeded') {
    let tbody = customFields.map((customField) => (
      <CustomFieldExcerpt
        key={customField.Id}
        customField={customField}
        openModal={openModal}
      />
    ))
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Delete ?</ModalHeader>
            <ModalBody>
              {
                "You're about to permanently this and all of its data. If you're not sure, you can close this instead."
              }
            </ModalBody>
            <ModalFooter>
              {/* I don't like this approach. Consider passing a prop to ModalFooter
               * that if present, would duplicate the buttons in a way similar to this.
               * Or, maybe find some way to pass something like size="large md:regular"
               * to Button
               */}
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button onClick={(e) => deleteConfirm(e, id)}>Accept</Button>
              </div>
            </ModalFooter>
          </Modal>
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Custom fields
            </h2>
          </div>
          <div className="mb-10 my-2 flex justify-between sm:flex-row flex-col">
            <AddCustomFieldForm />
          </div>
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Field Type
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{tbody}</tbody>
              </table>
              <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                <span className="text-xs xs:text-sm text-gray-900">
                  Showing 1 to 4 of 50 Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                    Prev
                  </button>
                  <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else if (customFieldStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="customFields-list">{content}</section>
}
