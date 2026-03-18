import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDashboard from './pages/Userdashboard'
import LoginPage from './pages/Login'
import Footer from './pages/Footer'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
