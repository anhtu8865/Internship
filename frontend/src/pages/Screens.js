import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectAllScreens, fetchScreens, deleteScreen, setErrorNull, setSuccessNull } from '../slices/screens'
import {
  selectAllScreenCustomFields,
  fetchScreenCustomFields,
} from '../slices/screenCustomFields'
import {
  selectAllCustomFields,
  fetchCustomFields,
} from '../slices/customFields'
import { useToasts } from 'react-toast-notifications'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@windmill/react-ui'
import { AddScreenForm } from '../components/Screen/AddScreenForm'
import { UpdateScreenForm } from '../components/Screen/UpdateScreenForm'


const ScreenExcerpt = ({ screen, listCustomFields, openModal }) => {
  return (
    <tr key={screen.Id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {screen.Name}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{screen.Description}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        {listCustomFields.map((customField) => (
          <p key={customField.Id} className="text-gray-900 whitespace-no-wrap">
            {customField.Name}
          </p>
        ))}
      </td>
      <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
        <UpdateScreenForm screenId={screen.Id} />
        </span>
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          />
          <a
            onClick={() => openModal(screen.Id)}
            className="relative cursor-pointer text-red-900"
          >
            Delete
          </a>
        </span>
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-blue-400 opacity-50 rounded-full"
          />
          <Link
            to={{
              pathname: `/screenCustomFields/${screen.Id}`,
              state: { screen, listCustomFields },
            }}
            className="relative cursor-pointer text-blue-900"
          >
            Configure
          </Link>
        </span>
      </td>
    </tr>
  )
}

export const Screens = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const screens = useSelector(selectAllScreens)
  const screenCustomFields = useSelector(selectAllScreenCustomFields)
  const customFields = useSelector(selectAllCustomFields)

  const screenStatus = useSelector((state) => state.screens.status)
  const customFieldStatus = useSelector((state) => state.customFields.status)
  const screenCustomFieldStatus = useSelector(
    (state) => state.screenCustomFields.status
  )

  const error = useSelector((state) => state.screens.error)
  const success = useSelector((state) => state.screens.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const errorScreenCustomField = useSelector(
    (state) => state.screenCustomFields.error
  )
  const errorCustomFields = useSelector((state) => state.customFields.error)

  useEffect(() => {
    if (screenStatus === 'idle') {
      dispatch(fetchScreens())
    }
    if (screenCustomFieldStatus === 'idle') {
      dispatch(fetchScreenCustomFields())
    }
    if (customFieldStatus === 'idle') {
      dispatch(fetchCustomFields())
    }
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
      dispatch(setErrorNull({error: null}))
    }
    if (success) {
      addToast(success, {
        appearance: 'success',
        autoDismiss: true,
      })
      dispatch(setSuccessNull({success: null}))
    }
  }, [screenStatus, screenCustomFieldStatus, customFieldStatus, dispatch, error, success])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteScreen({ Id }))
    closeModal()
  }
  let content

  if (
    screenStatus === 'loading' ||
    screenCustomFieldStatus === 'loading' ||
    customFieldStatus === 'loading'
  ) {
    content = <div className="loader">Loading...</div>
  } else if (
    screenStatus === 'succeeded' &&
    screenCustomFieldStatus === 'succeeded' &&
    customFieldStatus === 'succeeded'
  ) {
    let tbody = screens.map((screen) => {
      const listCustomFieldsId = screenCustomFields.filter(
        (row) => row?.Screen == screen.Id
      )
      const temp = customFields.filter((item1) =>
        listCustomFieldsId.some((item2) => item1.Id === item2.Custom_Field)
      )
      const listCustomFields = []
      temp.forEach((element) => {
        listCustomFieldsId.forEach((ele) => {
          if (element.Id === ele.Custom_Field) {
            listCustomFields.push({ ...element, Id: ele.Id })
          }
        })
      })
      return (
        <ScreenExcerpt
          key={screen.Id}
          screen={screen}
          listCustomFields={listCustomFields}
        openModal={openModal}
        />
      )
    })
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
            <h2 className="text-2xl font-semibold leading-tight">Screens</h2>
          </div>
          <div className="mb-10 my-2 flex justify-between sm:flex-row flex-col">
            <AddScreenForm />
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
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-green-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Custom Fields
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
  } else if (
    screenStatus === 'failed' ||
    screenCustomFieldStatus === 'failed' ||
    customFieldStatus === 'failed'
  ) {
    content = (
      <div>{(error, errorScreenCustomField, errorCustomFields)}</div>
    )
  }

  return (
    <section className="screens-list">
      {content}
    </section>
  )
}
