import React from 'react'
import { Outlet } from 'react-router-dom'

import Navbar from '../components/Navbar'
import MarqueeBanner from '../components/MarqueeBanner'

const DashboardLayout = () => {

    return (

        <div>

            <Navbar />

            <MarqueeBanner />

            <div className="pt-[120px] min-h-screen">

                <Outlet />

            </div>


        </div>

    )

}

export default DashboardLayout