import { useState } from 'react'
import { Users, Plus, Search, MoreVertical, CheckCircle2, XCircle, X } from 'lucide-react'

const MOCK_ADMINS = [
  { _id: '1', username: 'admin_raj',   coins: 5000, isActive: true,  createdAt: '2025-01-10' },
  { _id: '2', username: 'admin_priya', coins: 3200, isActive: true,  createdAt: '2025-01-15' },
  { _id: '3', username: 'admin_sam',   coins: 1800, isActive: false, createdAt: '2025-02-01' },
]

function CreateAdminModal({ onClose }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setDone(true)
    setTimeout(onClose, 1300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 dark:bg-black/50 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl p-6 animate-fade-up
                      bg-white dark:bg-slate-900
                      border border-slate-100 dark:border-slate-800
                      shadow-2xl shadow-slate-300/30 dark:shadow-slate-950/60">

        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Sora',sans-serif" }}>
              Create Admin
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Add a new admin to your platform</p>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
                       hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">Admin created successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'username', label: 'Username', type: 'text',     placeholder: 'admin_username' },
              { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  required
                  value={form[name]}
                  onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all
                             border border-slate-200 dark:border-slate-700
                             bg-slate-50 dark:bg-slate-800/60
                             text-slate-900 dark:text-slate-100
                             placeholder-slate-400 dark:placeholder-slate-500
                             focus:ring-2 focus:ring-sky-500 focus:border-sky-400
                             focus:bg-white dark:focus:bg-slate-800"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors
                           border border-slate-200 dark:border-slate-700
                           text-slate-600 dark:text-slate-300
                           hover:bg-slate-50 dark:hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold
                           transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  : <Plus className="w-4 h-4" />}
                {loading ? 'Creating…' : 'Create Admin'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminsPage() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = MOCK_ADMINS.filter(a =>
    a.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {showModal && <CreateAdminModal onClose={() => setShowModal(false)} />}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Sora',sans-serif" }}>
            Admins
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {MOCK_ADMINS.length} admins registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                     bg-sky-600 hover:bg-sky-700 text-white transition-all active:scale-95
                     shadow-sm shadow-sky-700/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Admin</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          placeholder="Search admins…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-none transition-all
                     border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-900 dark:text-slate-100
                     placeholder-slate-400 dark:placeholder-slate-500
                     focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800
                      bg-white dark:bg-slate-900"
           style={{ boxShadow: '0 1px 3px 0 rgb(0 0 0 / .06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                {['Username', 'Coins', 'Status', 'Created', ''].map(h => (
                  <th key={h} className="text-left px-6 py-3.5 text-xs font-semibold
                                         text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {filtered.map(admin => (
                <tr key={admin._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">{admin.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {admin.coins.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {admin.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                       bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                       bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                        <XCircle className="w-3 h-3" /> Blocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {admin.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800
                                       hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
            No admins found
          </div>
        )}
      </div>
    </div>
  )
}
