import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  selectAllIssues,
  fetchIssues,
  deleteIssue,
} from '../slices/issues'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'
import { UpdateIssueForm } from '../components/Issue/UpdateIssueForm'

const IssueExcerpt = ({ issue, openModal }) => {
  return (
    <TableRow key={issue.Id}>
      <TableCell>
        <div className="flex items-center text-sm">
          <div>
            <p className="font-semibold">{`${issue.Name} (${issue.Key})`}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{`${issue.Project_Name} (${issue.Project})`}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Issue_Type_Name}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Status}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Fields?.find((item) => item.Name === 'Assignee')?.Value}</span>
      </TableCell>
      <TableCell>
        <span className="text-sm">{issue.Fields?.find((item) => item.Name === 'Due Date')?.Value}</span>
      </TableCell>
      <TableCell>
        <UpdateIssueForm issue={issue} />
        <Badge
          className="ml-1 hover:bg-red-200 cursor-pointer"
          type={'danger'}
          onClick={() => openModal(issue.Id)}
        >
          Delete
        </Badge>
      </TableCell>
    </TableRow>
      //  <td className="px-5 py-5 text-center border-b border-gray-200 bg-white text-sm">
      //   <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
      //     <span
      //       aria-hidden
      //       className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
      //     />
      //     <Link
      //       to={`/editIssue/${issue.Id}`}
      //       className="relative cursor-pointer"
      //     >
      //       Edit
      //     </Link>
      //   </span>    
  )
}

export const Issues = () => {
  const dispatch = useDispatch()
  const issues = useSelector(selectAllIssues)

  const issueStatus = useSelector((state) => state.issues.status)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [id, setId] = useState()
  const error = useSelector((state) => state.issues.error)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = issues.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }
  useEffect(() => {
    if (issueStatus === 'idle') {
      dispatch(fetchIssues())
    }
  }, [issueStatus, dispatch])
  useEffect(() => {
    setData(issues.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [issues, page])
  function openModal(id) {
    setIsModalOpen(true)
    setId(id)
  }
  function closeModal() {
    setIsModalOpen(false)
  }
  function deleteConfirm(e, Id) {
    e.preventDefault()
    dispatch(deleteIssue({ Id }))
    closeModal()
  }
  let content

  if (issueStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (issueStatus === 'succeeded') {
    let tbody = data.map((issue) => {
      return <IssueExcerpt key={issue.Id} issue={issue} openModal={openModal} />
    })
    content = (
      <div className="container mx-auto px-4 mb-16 sm:px-8">
        <div className="py-8">
        <div className="mb-5 my-2 flex justify-between sm:flex-row flex-col">
            <h2 className="text-2xl font-semibold leading-tight">Issues</h2>
          </div>
          <TableContainer>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Name</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Issue type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Action</TableCell>
                </tr>
              </TableHeader>
              <TableBody>{tbody}</TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </TableContainer>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalHeader>Delete ?</ModalHeader>
            <ModalBody>
              {
                "You're about to permanently this and all of its data. If you're not sure, you can close this instead."
              }
            </ModalBody>
            <ModalFooter>
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
        </div>
      </div>
    )
  } else if (issueStatus === 'failed') {
    content = <div>{error}</div>
  }

  return <section className="issues-list">{content}</section>
}
