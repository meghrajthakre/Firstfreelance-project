import React from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import MarqueeBanner from '../components/MarqueeBanner'
import Footer from '../pages/Footer'

const MainLayout = () => {

  return (

    <div>

      <Navbar />
      <MarqueeBanner />
      <Outlet />
      <Footer />


    </div>

  )

}

export default MainLayout