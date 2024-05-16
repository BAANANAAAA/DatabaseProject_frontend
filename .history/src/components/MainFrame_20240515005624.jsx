import React, { useState, useEffect } from 'react'
import './MainFrame.css'

function MainFrame() {
  const [expanded, setExpanded] = useState({})
  const [replies, setReplies] = useState({})
  const [currentFilter, setCurrentFilter] = useState('all') // To manage the filter
  const [selectedTargets, setSelectedTargets] = useState({}) // To manage selected targets
  const [otherTargetNames, setOtherTargetNames] = useState({}) // To manage other target names
  const [friends, setFriends] = useState([])
  const [neighbours, setNeighbours] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([]) // To manage selected friends
  const [selectedNeighbours, setSelectedNeighbours] = useState([]) // To manage selected neighbours

  const users = [
    {
      id: 1,
      name: 'Alice',
      time: '19:00:00',
      location: 'hood',
      avatar: 'path_to_avatar1.png',
      title: 'Introduction to React',
      replies: [
        {
          username: 'John',
          avatar: 'path_to_avatar2.png',
          message: 'Good morning!',
        },
        {
          username: 'Sarah',
          avatar: 'path_to_avatar3.png',
          message: 'How are you doing?',
        },
      ],
    },
    {
      id: 2,
      name: 'Bob',
      time: '19:00:00',
      location: 'friend',
      avatar: 'path_to_avatar4.png',
      title: 'Advanced React Patterns',
      replies: [
        {
          username: 'Mike',
          avatar: 'path_to_avatar5.png',
          message: 'Nice post!',
        },
      ],
    },
    {
      id: 3,
      name: 'Charlie',
      time: '19:00:00',
      location: 'block',
      avatar: 'path_to_avatar6.png',
      title: 'Handling State',
      replies: [],
    },
  ]

  const fetchTargets = async (type) => {
    const response = await fetch(`/api/${type}`)
    const data = await response.json()
    return data[type]
  }

  useEffect(() => {
    if (selectedTargets[currentFilter] === 'friend') {
      fetchTargets('friends').then((data) => setFriends(data))
    } else if (selectedTargets[currentFilter] === 'neighbour') {
      fetchTargets('neighbours').then((data) => setNeighbours(data))
    }
  }, [selectedTargets, currentFilter])

  const handleReplyChange = (id, value) => {
    setReplies((prev) => ({ ...prev, [id]: value }))
  }

  const handleTargetChange = (id, value) => {
    setSelectedTargets((prev) => ({ ...prev, [id]: value }))
    if (value !== 'other') {
      setOtherTargetNames((prev) => ({ ...prev, [id]: '' }))
    }
  }

  const handleOtherTargetNameChange = (id, value) => {
    setOtherTargetNames((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectAll = (type, checked) => {
    if (type === 'friend') {
      setSelectedFriends(checked ? friends.map((f) => f.name) : [])
    } else if (type === 'neighbour') {
      setSelectedNeighbours(checked ? neighbours.map((n) => n.name) : [])
    }
  }

  const handleSelectTarget = (type, name, checked) => {
    if (type === 'friend') {
      setSelectedFriends((prev) =>
        checked ? [...prev, name] : prev.filter((f) => f !== name)
      )
    } else if (type === 'neighbour') {
      setSelectedNeighbours((prev) =>
        checked ? [...prev, name] : prev.filter((n) => n !== name)
      )
    }
  }

  const submitReply = async (id) => {
    const replyMessage = replies[id]
    let target = []
    if (selectedTargets[id] === 'friend') {
      target = selectedFriends
    } else if (selectedTargets[id] === 'neighbour') {
      target = selectedNeighbours
    } else {
      target =
        selectedTargets[id] === 'other'
          ? otherTargetNames[id]
          : selectedTargets[id]
    }
    console.log(`Reply from ${id} to ${target}: ${replyMessage}`)

    try {
      const response = await fetch('/api/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id, message: replyMessage, target }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Reply submitted successfully')
        // Optionally, update the UI with the new reply
        // Here we just clear the input after submission
        setReplies((prev) => ({ ...prev, [id]: '' }))
        setSelectedTargets((prev) => ({ ...prev, [id]: 'hood' }))
        setOtherTargetNames((prev) => ({ ...prev, [id]: '' }))
        setSelectedFriends([])
        setSelectedNeighbours([])
      } else {
        throw new Error(data.message || 'Failed to submit reply')
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Error submitting reply: ' + error.message)
    }
  }

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredUsers =
    currentFilter === 'all'
      ? users
      : users.filter((user) => user.location === currentFilter)

  return (
    <div className="MainFrame">
      <div className="sidebar">
        <button
          className={currentFilter === 'all' ? 'active' : ''}
          onClick={() => setCurrentFilter('all')}>
          All
        </button>
        <button
          className={currentFilter === 'hood' ? 'active' : ''}
          onClick={() => setCurrentFilter('hood')}>
          Hood
        </button>
        <button
          className={currentFilter === 'friend' ? 'active' : ''}
          onClick={() => setCurrentFilter('friend')}>
          Friend
        </button>
        <button
          className={currentFilter === 'block' ? 'active' : ''}
          onClick={() => setCurrentFilter('block')}>
          Block
        </button>
        <button
          className={currentFilter === 'neighbour' ? 'active' : ''}
          onClick={() => setCurrentFilter('neighbour')}>
          Neighbour
        </button>
      </div>
      <div className="content">
        {filteredUsers.map((user) => (
          <div key={user.id} className="post-card">
            <div className="post-header" onClick={() => toggleExpand(user.id)}>
              <img
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="post-avatar"
              />
              <div>
                <div className="post-name">
                  {user.name} - {user.time} - {user.location}
                </div>
                <div className="post-title">{user.title}</div>
              </div>
              <button className="expand-button">
                {expanded[user.id] ? '▲' : '▼'}
              </button>
            </div>
            <div className="post-reply-input">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replies[user.id] || ''}
                onChange={(e) => handleReplyChange(user.id, e.target.value)}
              />
              <select
                value={selectedTargets[user.id] || 'hood'}
                onChange={(e) => handleTargetChange(user.id, e.target.value)}>
                <option value="hood">Hood</option>
                <option value="block">Block</option>
                <option value="neighbour">Neighbour</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
              {selectedTargets[user.id] === 'other' && (
                <input
                  type="text"
                  className="other-target-input"
                  placeholder="Enter name"
                  value={otherTargetNames[user.id] || ''}
                  onChange={(e) =>
                    handleOtherTargetNameChange(user.id, e.target.value)
                  }
                />
              )}
              {(selectedTargets[user.id] === 'friend' ||
                selectedTargets[user.id] === 'neighbour') && (
                <div className="checkbox-group">
                  <div className="select-all">
                    <input
                      type="checkbox"
                      id={`select-all-${selectedTargets[user.id]}`}
                      onChange={(e) =>
                        handleSelectAll(
                          selectedTargets[user.id],
                          e.target.checked
                        )
                      }
                    />
                    <label htmlFor={`select-all-${selectedTargets[user.id]}`}>
                      Select All
                    </label>
                  </div>
                  {(selectedTargets[user.id] === 'friend'
                    ? friends
                    : neighbours
                  ).map((target) => (
                    <div key={target.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`checkbox-${selectedTargets[user.id]}-${
                          target.name
                        }`}
                        checked={
                          selectedTargets[user.id] === 'friend'
                            ? selectedFriends.includes(target.name)
                            : selectedNeighbours.includes(target.name)
                        }
                        onChange={(e) =>
                          handleSelectTarget(
                            selectedTargets[user.id],
                            target.name,
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`checkbox-${selectedTargets[user.id]}-${
                          target.name
                        }`}>
                        {target.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => submitReply(user.id)}>Send</button>
            </div>
            {expanded[user.id] && (
              <div className="post-details">
                {user.replies.map((reply, index) => (
                  <div key={index} className="reply">
                    <img
                      src={reply.avatar}
                      alt={`${reply.username}'s avatar`}
                      className="reply-avatar"
                    />
                    <div className="reply-message">
                      <strong>{reply.username}:</strong> {reply.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainFrame
