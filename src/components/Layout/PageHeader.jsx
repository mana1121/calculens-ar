import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-4 p-4 pt-safe">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#A78BFA] hover:text-[#C4B5FD] transition-colors"
      >
        ←
      </motion.button>
      <div>
        <h1 className="font-heading font-bold text-lg text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-[#9CA3AF] text-sm">{subtitle}</p>}
      </div>
    </div>
  )
}
