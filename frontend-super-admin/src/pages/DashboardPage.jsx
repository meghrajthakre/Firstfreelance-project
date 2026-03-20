import { MessageSquare, AlignJustify, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const roleLabel = { superadmin: 'Super Admin', admin: 'Admin', user: 'User' }

  const cards = [
    { icon: MessageSquare, label: 'User ID',  value: user?.username || 'star' },
    { icon: AlignJustify,  label: 'Level',    value: roleLabel[user?.role] || 'Super Admin' },
    { icon: Mail,          label: 'Contact',  value: user?.email || 'contact@admin.com' },
  ]

  const stats = [
    { label: 'Total Admins',   value: '—',  lightBg: 'bg-blue-50',    lightTxt: 'text-blue-600',    darkBg: 'dark:bg-blue-950/40',    darkTxt: 'dark:text-blue-400' },
    { label: 'Total Users',    value: '—',  lightBg: 'bg-emerald-50', lightTxt: 'text-emerald-600', darkBg: 'dark:bg-emerald-950/40', darkTxt: 'dark:text-emerald-400' },
    { label: 'Total Coins',    value: '0',  lightBg: 'bg-amber-50',   lightTxt: 'text-amber-600',   darkBg: 'dark:bg-amber-950/40',   darkTxt: 'dark:text-amber-400' },
    { label: 'Active Matches', value: '—',  lightBg: 'bg-violet-50',  lightTxt: 'text-violet-600',  darkBg: 'dark:bg-violet-950/40',  darkTxt: 'dark:text-violet-400' },
  ]

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Sora',sans-serif" }}>
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Welcome back,{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{user?.username}</span>
        </p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800
                       p-6 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
            style={{
              boxShadow: '0 1px 3px 0 rgb(0 0 0 / .06)',
              animationDelay: `${i * 80}ms`,
            }}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                {label}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Sora',sans-serif" }}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, lightBg, lightTxt, darkBg, darkTxt }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800
                       px-5 py-4 flex items-center justify-between"
            style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / .05)' }}
          >
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
            <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${lightBg} ${lightTxt} ${darkBg} ${darkTxt}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
