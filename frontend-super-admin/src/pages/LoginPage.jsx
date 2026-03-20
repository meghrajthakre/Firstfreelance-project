import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Activity, Lock, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, loading, error, setError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const ok = await login(username, password)
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* Theme toggle — top right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex lg:w-[44%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 55%, #38bdf8 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: "'Sora',sans-serif" }}>
            Top11
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-widest mb-4">
            Superadmin Control Panel
          </p>
          <h1 className="text-white text-[2.6rem] font-bold leading-tight mb-5" style={{ fontFamily: "'Sora',sans-serif" }}>
            Manage your<br />platform with<br />confidence.
          </h1>
          <p className="text-sky-100/70 text-sm leading-relaxed max-w-xs">
            Real-time visibility across admins, users, matches, and collections — all in one place.
          </p>
        </div>

        {/* Tags */}
        <div className="relative flex flex-wrap gap-2">
          {['🔒 Secure', '⚡ Real-time', '👥 Multi-role', '📊 Analytics'].map(tag => (
            <span key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white/80 bg-white/10 border border-white/10">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[360px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white text-lg font-bold" style={{ fontFamily: "'Sora',sans-serif" }}>
              Top11
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1"
                style={{ fontFamily: "'Sora',sans-serif" }}>
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Sign in to your superadmin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="superadmin"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all duration-150
                             border border-slate-200 dark:border-slate-700
                             bg-slate-100 dark:bg-slate-800/60
                             text-slate-900 dark:text-slate-100
                             placeholder-slate-400 dark:placeholder-slate-500
                             focus:ring-2 focus:ring-sky-500 focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 text-sm rounded-xl outline-none transition-all duration-150
                             border border-slate-200 dark:border-slate-700
                             bg-slate-100 dark:bg-slate-800/60
                             text-slate-900 dark:text-slate-100
                             placeholder-slate-400 dark:placeholder-slate-500
                             focus:ring-2 focus:ring-sky-500 focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-800"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500
                             hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl animate-fade-in
                              bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 mt-1 rounded-xl
                         bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold
                         transition-all duration-150 active:scale-95
                         disabled:opacity-60 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                         dark:focus:ring-offset-slate-950 shadow-sm shadow-sky-700/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3.5 rounded-xl text-center bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Demo credentials</p>
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              superadmin &nbsp;/&nbsp; SuperAdmin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
