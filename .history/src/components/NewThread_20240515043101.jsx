import React, { useState } from 'react'
import './NewThread.css'

function NewThread({ onThreadCreated }) {
  const [tType, setTType] = useState('')
  const [tCreatorID, setTCreatorID] = useState('')
  const [tCreateTime, setTCreateTime] = useState('')
  const [tReceiverID, setTReceiverID] = useState('')
  const [toBlockID, setToBlockID] = useState('')
  const [toHoodID, setToHoodID] = useState('')
  const [targetName, setTargetName] = useState('')
  const [threadContent, setThreadContent] = useState('') // State to hold thread content

  const handleSubmit = async (event) => {
    event.preventDefault()
    const thread = {
      tType,
      tCreatorID,
      tCreateTime,
      tReceiverID,
      toBlockID,
      toHoodID,
      targetName,
      content: threadContent,
    }

    // POST request to backend to create new thread
    const response = await fetch('/api/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thread),
    })

    if (response.ok) {
      onThreadCreated()
      alert('Thread created successfully')
      // Reset form
      setTType('')
      setTargetName('')
      setThreadContent('') // Reset the content field
    } else {
      alert('Failed to create thread')
    }
  }

  return (
    <div className="NewThread">
      <form onSubmit={handleSubmit}>
        <select value={tType} onChange={(e) => setTType(e.target.value)}>
          <option value="">Select Type</option>
          <option value="All">All</option>
          <option value="SingleFriend">Single Friend</option>
          <option value="SingleNeighbor">Single Neighbor</option>
          <option value="Friends">Friends</option>
          <option value="Neighbors">Neighbors</option>
          <option value="Block">Block</option>
          <option value="Hood">Hood</option>
        </select>

        {(tType === 'SingleFriend' || tType === 'SingleNeighbor') && (
          <input
            type="text"
            placeholder={`Enter ${
              tType === 'SingleFriend' ? "Friend's" : "Neighbor's"
            } Name`}
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
        )}

        <textarea
          placeholder="Enter thread content..."
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
          rows="4"></textarea>

        <button type="submit">Create Thread</button>
      </form>
    </div>
  )
}

export default NewThread
