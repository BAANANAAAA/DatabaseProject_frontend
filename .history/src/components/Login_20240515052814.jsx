import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Login.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function LocationPicker({ onLocationSelect, onAddressSelect }) {
  const [position, setPosition] = useState(null)

  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const latlng = e.latlng
        setPosition(latlng)
        onLocationSelect(latlng)
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.address) {
              const address = `${data.address.road || ''}, ${
                data.address.city || ''
              }, ${data.address.country || ''}`
              onAddressSelect(address)
            }
          })
      },
    })

    return position === null ? null : <Marker position={position}></Marker>
  }

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  )
}

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [intro, setIntro] = useState('')
  const [address, setAddress] = useState('')
  const [location, setLocation] = useState(null)
  const [registerMode, setRegisterMode] = useState(false)

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch('http://192.168.1.27:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: password1 }),
      })

      const data = await response.json()
      if (response.ok) {
        setUser(data) // 保存用户数据
        onLogin(data)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    const homeLocation = location
      ? { lat: location.lat, lng: location.lng }
      : null

    try {
      const response = await fetch('http://192.168.1.27:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password2,
          userAddress: address,
          homeLocation,
          userProfile: intro,
          userPhoto: avatar,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        onRegister(data)
        alert('Registration successful! You can now log in.')
        setRegisterMode(false)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred during registration.')
    }
  }

  const toggleRegister = () => {
    setRegisterMode(!registerMode)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button onClick={toggleRegister} className="register-toggle">
          {registerMode ? 'Cancel' : 'Register'}
        </button>
        {registerMode && (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="text"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="avatar">Avatar URL:</label>
              <input
                id="avatar"
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Enter URL of your avatar"
              />
            </div>
            <div className="form-group">
              <label htmlFor="intro">Personal Intro:</label>
              <textarea
                id="intro"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Describe yourself"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter or select your address"
              />
            </div>
            <LocationPicker
              onLocationSelect={setLocation}
              onAddressSelect={setAddress}
            />
            <button type="submit" className="register-button">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
