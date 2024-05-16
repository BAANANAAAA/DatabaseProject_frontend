import React, { useState, useEffect } from 'react'
import './ViewMessage.css'

function getNewYorkTimeISO() {
  const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }

  const dateTimeFormat = new Intl.DateTimeFormat('en-US', options)
  const parts = dateTimeFormat.formatToParts(new Date())
  const { year, month, day, hour, minute, second } = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  )

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`
}

function ViewMessage(props) {
  const { userId } = props
  const [friendRequests, setFriendRequests] = useState([])
  const [blockRequests, setBlockRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const friendResponse = await fetch(
        'http://192.168.1.27:3000/api/getfriendapplication',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID: userId }),
        }
      )
      const blockResponse = await fetch(
        'http://192.168.1.27:3000/api/getblockapplication',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, timestamp: getNewYorkTimeISO() }),
        }
      )
      const friendData = await friendResponse.json()
      const blockData = await blockResponse.json()
      if (friendResponse.ok && blockResponse.ok) {
        console.log(`friendData received: `, friendData)
        setFriendRequests(friendData.data)
        setBlockRequests(blockData.data)
      } else {
        throw new Error('Failed to fetch requests')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      alert('Error fetching requests: ' + error.message)
    }
  }

  const handleResponse = async (AppID, accepted, type) => {
    const decision = accepted ? 'approved' : 'rejected'

    const url =
      type === 'friend'
        ? `http://192.168.1.27:3000/api/processfriendapplication`
        : `http://192.168.1.27:3000/api/processblockapplication`

    const appIDKey = type === 'friend' ? 'fAppID' : 'bAppID'

    try {
      const body = JSON.stringify({
        userId,
        [appIDKey]: AppID,
        decision,
      })

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })

      const data = await response.json()

      if (response.ok) {
        fetchRequests()

        if (type === 'friend') {
          setFriendRequests(
            friendRequests.filter((request) => request.fAppID !== AppID)
          )
        } else {
          setBlockRequests(
            blockRequests.filter((request) => request.bAppID !== AppID)
          )
        }
      } else {
        throw new Error(data.message || 'Failed to respond to request')
      }
    } catch (error) {
      console.error('Error responding to request:', error)
      alert('Error responding to request: ' + error.message)
    }
  }

  return (
    <div className="view-messages-container">
      <div className="card">
        <h2>Friend Requests</h2>
        {friendRequests.map((request) => (
          <div key={request.fappid} className="request-item">
            <p>
              From User: <span className="highlight">{request.name}</span> -
              Request Time:
              <span className="highlight">
                {new Date(request.fappcreatetime).toLocaleString()}
              </span>{' '}
              - Status: <span className="highlight">{request.fappstatus} </span>
              {` - Decision: `}
              <span className="highlight">{request.decision}</span>
            </p>
            {request.decision === 'pending' ? (
              <>
                <button
                  className="button approve-button"
                  onClick={() =>
                    handleResponse(request.fappid, true, 'friend')
                  }>
                  Accept
                </button>
                <button
                  className="button reject-button"
                  onClick={() =>
                    handleResponse(request.fappid, false, 'friend')
                  }>
                  Reject
                </button>
              </>
            ) : request.decision === 'approved' ? (
              <>
                <button className="button approved-button" disabled>
                  Accepted
                </button>
                <button className="button disabled-button" disabled>
                  Reject
                </button>
              </>
            ) : request.decision === 'rejected' ? (
              <>
                <button className="button disabled-button" disabled>
                  Accept
                </button>
                <button className="button rejected-button" disabled>
                  Rejected
                </button>
              </>
            ) : (
              <>
                <button className="button disabled-button" disabled>
                  Accept
                </button>
                <button className="button disabled-button" disabled>
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Block Requests</h2>
        {blockRequests.map((request) => (
          <div key={request.fromID} className="request-item">
            <p>
              From User: <span className="highlight">{request.name}</span> -
              Request Time:{' '}
              <span className="highlight">
                {new Date(request.bAppCreateTime).toLocaleString()}
              </span>{' '}
              - Status: <span className="highlight">{request.appStatus}</span>
              {` - Decision: `}
              <span className="highlight">{request.userDecision}</span>
            </p>
            {!request.userDecision && request.appStatus === 'pending' ? (
              <>
                <button
                  className="button approve-button"
                  onClick={() => handleResponse(request.bAppID, true, 'block')}>
                  Accept
                </button>
                <button
                  className="button reject-button"
                  onClick={() =>
                    handleResponse(request.bAppID, false, 'block')
                  }>
                  Reject
                </button>
              </>
            ) : request.userDecision === 'approved' ? (
              <>
                <button className="button approved-button" disabled>
                  Accepted
                </button>
                <button className="button disabled-button" disabled>
                  Reject
                </button>
              </>
            ) : request.userDecision === 'rejected' ? (
              <>
                <button className="button disabled-button" disabled>
                  Accept
                </button>
                <button className="button rejected-button" disabled>
                  Rejected
                </button>
              </>
            ) : (
              <>
                <button className="button disabled-button" disabled>
                  Accept
                </button>
                <button className="button disabled-button" disabled>
                  Reject
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewMessage
