import { NavLink, useNavigate } from 'react-router-dom'
import {
  Activity, Users, FileText, Trophy, Grid2x2,
  DollarSign, Radio, KeyRound, Settings, LogOut, X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Dashboard',         icon: Activity,   to: '/dashboard' },
  { label: 'Admins',            icon: Users,      to: '/admins' },
  { label: 'Collection Report', icon: FileText,   to: '/collection-report' },
  { label: 'Matches',           icon: Trophy,     to: '/matches' },
  { label: 'Matka',             icon: Grid2x2,    to: '/matka' },
  { label: 'Cup Rates',         icon: DollarSign, to: '/cup-rates' },
  { label: 'In Play Bet Fair',  icon: Radio,      to: '/in-play-bet-fair' },
  { label: 'Change Password',   icon: KeyRound,   to: '/change-password' },
  { label: 'Settings',          icon: Settings,   to: '/settings' },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-30 flex flex-col w-[220px]
        bg-white dark:bg-slate-900
        border-r border-slate-100 dark:border-slate-800
        transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto lg:shadow-none
        ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white text-lg font-bold tracking-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
              Top11
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                 ${isActive
                   ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400 font-semibold'
                   : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                 }`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium
                       text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 transition-all duration-150"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
