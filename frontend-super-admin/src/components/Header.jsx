import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800
                       flex items-center justify-between px-5 shrink-0 sticky top-0 z-10
                       transition-colors duration-200">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400
                   hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Bell */}
        <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400
                           hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-sky-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Avatar dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropOpen(v => !v)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none capitalize">
                {user?.username}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-none mt-0.5 capitalize">
                {user?.role}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 z-20 overflow-hidden
                              bg-white dark:bg-slate-800
                              border border-slate-100 dark:border-slate-700
                              rounded-xl shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{user?.username}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40
                             hover:text-red-600 transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
