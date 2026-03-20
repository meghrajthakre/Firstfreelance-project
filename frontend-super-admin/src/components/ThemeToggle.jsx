import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-[52px] h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      style={{ background: dark ? '#0ea5e9' : '#e2e8f0' }}
    >
      {/* Track icons */}
      <Sun  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500 transition-opacity duration-200"
            style={{ opacity: dark ? 0 : 1 }} />
      <Moon className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white transition-opacity duration-200"
            style={{ opacity: dark ? 1 : 0 }} />

      {/* Knob */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300"
        style={{ transform: dark ? 'translateX(26px)' : 'translateX(2px)' }}
      />
    </button>
  )
}
