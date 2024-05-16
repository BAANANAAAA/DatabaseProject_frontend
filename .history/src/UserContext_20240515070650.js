import React, { createContext, useState, useContext } from 'react'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ isLoggedIn: false, userId: null, username: null })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
