import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const messages = [
  'Differentiating your request...',
  'Integrating your knowledge...',
  'Finding the limit of possibilities...',
  'Calculating the area of awesomeness...',
  'Revolving your understanding...',
  'Computing derivatives...',
  'Converging to the answer...',
]

export default function Loading({ message, fullScreen = false }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    if (message) return
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [message])

  const displayMsg = message || messages[msgIndex]

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated rings */}
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#4A2D8C]"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-[#A78BFA]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-t-[#8B5CF6] border-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl">∫</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={displayMsg}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-[#A78BFA] font-heading text-sm text-center max-w-xs"
        >
          {displayMsg}
        </motion.p>
      </AnimatePresence>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0A0118]/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return <div className="flex items-center justify-center p-8">{content}</div>
}
