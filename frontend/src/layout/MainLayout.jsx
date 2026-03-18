import React from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import MarqueeBanner from '../components/MarqueeBanner'

const MainLayout = () => {

  return (

    <div>

      <Navbar />

      <MarqueeBanner />

      <Outlet />

    </div>

  )

}

export default MainLayout