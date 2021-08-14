import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { addNewIssueType } from '../../slices/issueTypes'

export const AddIssueTypeForm = () => {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)
  const onIconChanged = (e) => setIcon(e.target.value)
  const canSave =
    [name, icon].every(Boolean) && addRequestStatus === 'idle'

  const onSaveIssueTypeClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        setName('')
        setIcon('')
        setDescription('')
        history.push(`/issueTypes`)
        const resultAction = await dispatch(
          addNewIssueType({
            Name: name,
            Icon: icon,
            Description: description,
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the issueType: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  
  return (
    <main>
      <section className="absolute w-full h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-gray-500 text-center mb-3 font-bold">
                    <h2>Add a New IssueType</h2>
                  </div>
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueTypeName"
                      >
                        IssueType Name:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        //placeholder="Email"
                        value={name}
                        onChange={onNameChanged}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueTypeIcon"
                      >
                        IssueType Icon:
                      </label>
                      <input
                        type="text"
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        //placeholder="Email"
                        value={icon}
                        onChange={onIconChanged}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>

                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="issueTypeDescription"
                      >
                        Description:
                      </label>
                      <textarea
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        value={description}
                        onChange={onDescriptionChanged}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        onClick={onSaveIssueTypeClicked}
                        disabled={!canSave}
                        style={{ transition: 'all .15s ease' }}
                      >
                        Save IssueType
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
