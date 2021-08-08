import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { useHistory } from 'react-router-dom'
import { updateScreen, selectScreenById } from '../../slices/screens'

export const UpdateScreenForm = ({ match }) => {
  const { screenId } = match.params
  const screen = useSelector((state) => selectScreenById(state, screenId))
  const [name, setName] = useState(screen.Name)
  const [description, setDescription] = useState(screen.Description)
  const [updateRequestStatus, setUpdateRequestStatus] = useState('idle')

  const dispatch = useDispatch()
  const history = useHistory()
  const onNameChanged = (e) => setName(e.target.value)
  const onDescriptionChanged = (e) => setDescription(e.target.value)

  const canSave =
    [name].every(Boolean) && updateRequestStatus === 'idle'

  const onSaveScreenClicked = async () => {
    if (canSave) {
      try {
        setUpdateRequestStatus('pending')
        const resultAction = await dispatch(updateScreen({Id: screenId, Name:name, Description:description }))
        unwrapResult(resultAction)
        setName('')
        setDescription('')
        history.push(`/screens`)
      } catch (err) {
        console.error('Failed to save the screen: ', err)
      } finally {
        setUpdateRequestStatus('idle')
      }
    }
  }
  return (
    <main>
      <section className="absolute w-full h-full">
        <div className="container mx-auto px-4 h-full">
          <div className="flex description-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0">
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div className="text-gray-500 text-center mb-3 font-bold">
                    <h2>Update a New Screen</h2>
                  </div>
                  <form>
                    <div className="relative w-full mb-3">
                      <label
                        className="block uppercase text-gray-700 text-xs font-bold mb-2"
                        htmlFor="screenName"
                      >
                        Screen Name:
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
                        htmlFor="screenDescription"
                      >
                        Description:
                      </label>
                      <textarea
                        className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                        //placeholder="Password"
                        value={description}
                        onChange={onDescriptionChanged}
                        style={{ transition: 'all .15s ease' }}
                      />
                    </div>
                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full"
                        type="button"
                        onClick={onSaveScreenClicked}
                        disabled={!canSave}
                        style={{ transition: 'all .15s ease' }}
                      >
                        Save Screen
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
