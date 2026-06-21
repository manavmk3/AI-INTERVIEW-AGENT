import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Auth from './pages/Auth'

export const ServerUrl = "http://localhost:6000"

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
    </Routes>
  )
}

export default App