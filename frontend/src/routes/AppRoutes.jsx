import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LoginPage from '../pages/Login'
import UserDashboard from '../pages/Userdashboard'
import Footer from '../pages/Footer'

import MainLayout from '../layout/MainLayout'
import DashboardRoutes from './DashboardRoutes'
import DashboardLayout from '../layout/DashboardLayout'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
    return (

        <BrowserRouter>

            <Routes>
                {/* Public */}
                <Route path="/" element={<LoginPage />} />
                {/* Protected layout */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route element={<DashboardLayout />}>
                        {DashboardRoutes()}
                    </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </BrowserRouter>

    )
}

export default AppRoutes