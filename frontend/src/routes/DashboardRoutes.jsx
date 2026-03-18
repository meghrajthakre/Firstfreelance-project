import React from 'react'
import { Route } from 'react-router-dom'

import Live from '../pages/dashboard/Live'
import Rules from '../pages/dashboard/Rules'
import Settings from '../pages/dashboard/Settings'
import Ledger from '../pages/dashboard/Ledger'
import DashboardHome from '../pages/dashboard/DashboardHome'

const DashboardRoutes = () => {

    return (

        <>

            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="dashboard/live" element={<Live />} />
            <Route path="dashboard/rules" element={<Rules />} />
            <Route path="dashboard/settings" element={<Settings />} />
            <Route path="dashboard/ledger" element={<Ledger />} />

        </>

    )

}

export default DashboardRoutes