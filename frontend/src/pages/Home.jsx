import React from 'react'
import { useHistory } from 'react-router-dom'

function Home() {
  const history = useHistory()
  history.push('/login')

  return (
    <>
      <h1 className="text-5xl mx-auto">Home</h1>
    </>
  )
}

export default Home
