import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllIssueTypes,
  fetchIssueTypes,
  deleteIssueType,
  setErrorNull,
  setSuccessNull,
} from '../slices/issueTypes'
import {
  selectAllProjectIssueTypeScreens,
  fetchProjectIssueTypeScreens,
} from '../slices/projectIssueTypeScreens'
import { selectAllScreens, fetchScreens } from '../slices/screens'
import { fetchProjects, selectAllProjects } from '../slices/projects'
import { useToasts } from 'react-toast-notifications'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@windmill/react-ui'
import { AddIssueTypeForm } from '../components/IssueType/AddIssueTypeForm'
import { UpdateIssueTypeForm } from '../components/IssueType/UpdateIssueTypeForm'

const IssueTypeExcerpt = ({
  issueType,
  projectIssueTypeScreensHaveName,
  openModal,
}) => {
  return (
    <tr key={issueType.Id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
          <div className="ml-3">
            <p className="text-gray-900 whitespace-no-wrap">
              <Link to="#">
                <a className="text-blue-400 whitespace-no-wrap">
                  {issueType.Name}
                </a>
              </Link>
            </p>
          </div>
        </div>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{issueType.Icon}</p>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">
          {issueType.Description}
        </p>
      </td>
      <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
          <UpdateIssueTypeForm issueTypeId={issueType.Id} />
        </span>
        <span className="relative inline-block px-3 ml-1.5 py-1 font-semibold text-green-900 leading-tight">
          <span
            aria-hidden
            className="absolute inset-0 bg-red-400 opacity-50 rounded-full"
          />
          <a
            onClick={() => openModal(issueType.Id)}
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
              pathname: `/projectIssueTypeScreens/${issueType.Id}`,
              state: { issueType, projectIssueTypeScreensHaveName },
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

export const IssueTypes = () => {
  const { addToast } = useToasts()
  const dispatch = useDispatch()
  const issueTypes = useSelector(selectAllIssueTypes)
  const projectIssueTypeScreens = useSelector(selectAllProjectIssueTypeScreens)
  const screens = useSelector(selectAllScreens)
  const projects = useSelector(selectAllProjects)

  const issueTypeStatus = useSelector((state) => state.issueTypes.status)
  const projectIssueTypeScreenStatus = useSelector(
    (state) => state.projectIssueTypeScreens.status
  )
  const screenStatus = useSelector((state) => state.screens.status)
  const projectStatus = useSelector((state) => state.projects.loading)

  const error = useSelector((state) => state.issueTypes.error)
  const success = useSelector((state) => state.issueTypes.success)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const errorProjectIssueTypeScreen = useSelector(
    (state) => state.projectIssueTypeScreens.error
  )
  const errorScreens = useSelector((state) => state.screens.error)

  useEffect(() => {
    if (issueTypeStatus === 'idle') {
      dispatch(fetchIssueTypes())
    }
    if (projectIssueTypeScreenStatus === 'idle') {
      dispatch(fetchProjectIssueTypeScreens())
    }
    if (screenStatus === 'idle') {
      dispatch(fetchScreens())
    }
    if (projects.length === 0 && projectStatus === false) {
      dispatch(fetchProjects())
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
  }, [
    issueTypeStatus,
    projectIssueTypeScreenStatus,
    screenStatus,
    dispatch,
    error,
    success,
  ])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteIssueType({ Id }))
    closeModal()
  }
  let content
  //console.log(issueTypeStatus, projectIssueTypeScreenStatus, screenStatus, projectStatus, "lllllllllllllllll")
  if (
    issueTypeStatus === 'loading' ||
    projectIssueTypeScreenStatus === 'loading' ||
    screenStatus === 'loading' ||
    projectStatus === true
  ) {
    content = <div className="loader">Loading...</div>
  } else if (
    issueTypeStatus === 'succeeded' &&
    projectIssueTypeScreenStatus === 'succeeded' &&
    screenStatus === 'succeeded' &&
    projectStatus === false
  ) {
    // gan ten cua screen va project vao danh sach
    const projectIssueTypeScreensHaveName = []
    projectIssueTypeScreens.forEach((element) => {
      screens.forEach((ele) => {
        if (element.Screen === ele.Id) {
          projectIssueTypeScreensHaveName.push({
            ...element,
            ScreenName: ele.Name,
          })
        }
      })
    })
    projectIssueTypeScreensHaveName.forEach((element) => {
      projects.forEach((ele) => {
        if (element.Project === ele.ProjectKey) {
          element.ProjectName = ele.ProjectName
        }
      })
    })

    let tbody = issueTypes.map((issueType) => {
      const temp = projectIssueTypeScreensHaveName.filter(
        (item1) => item1.Issue_Type === issueType.Id
      )
      return (
        <IssueTypeExcerpt
          key={issueType.Id}
          issueType={issueType}
          projectIssueTypeScreensHaveName={temp}
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
            <h2 className="text-2xl font-semibold leading-tight">Issue types</h2>
          </div>
          <div className="mb-10 my-2 flex justify-between sm:flex-row flex-col">
            <AddIssueTypeForm />
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
                      Icon
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
  } else if (issueTypeStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="issueTypes-list">{content}</section>
}
