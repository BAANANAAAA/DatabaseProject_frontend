import React, { useState } from 'react'
import './Apply.css'

function Apply(userId) {
  const [blockName, setBlockName] = useState('')

  const handleBlockJoinSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch('/api/addBlock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockName }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Request submitted successfully')
        setBlockName('')
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again later.')
    }
  }

  return (
    <div className="application-container">
      <div className="join-block-container">
        <h2>Join a Block</h2>
        <form onSubmit={handleBlockJoinSubmit}>
          <div className="form-group">
            <label htmlFor="blockName">Block Name:</label>
            <input
              id="blockName"
              type="text"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
              placeholder="Enter block name"
            />
          </div>
          <button type="submit" className="join-block-button">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  )
}

export default Apply
