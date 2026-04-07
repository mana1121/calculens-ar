import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/snap-solve', label: 'Snap', icon: '📸' },
  { path: '/chat', label: 'Chat', icon: '🤖' },
  { path: '/ar', label: 'AR', icon: '🔮' },
]

export default function TabBar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">
      <div className="glass-dark border-t border-[#BBDEFB] flex items-center justify-around px-2 py-2 safe-area-bottom">
        {tabs.map((tab) => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path)

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all"
            >
              <motion.div
                animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="text-2xl"
              >
                {tab.icon}
              </motion.div>
              <span
                className={`text-xs font-heading font-medium transition-colors ${
                  isActive ? 'text-[#1565C0]' : 'text-[#64748B]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 w-1 h-1 rounded-full bg-[#1565C0]"
                />
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
