import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function PlaceholderPage() {
  const { pathname } = useLocation()
  const name = pathname.slice(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
        <Construction className="w-7 h-7 text-slate-400 dark:text-slate-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2" style={{ fontFamily: "'Sora',sans-serif" }}>
        {name}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
        This section is under construction. Wire it up to your API to bring it to life.
      </p>
    </div>
  )
}
