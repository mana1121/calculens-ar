import { motion } from 'framer-motion'
import MathDisplay from '../Shared/MathDisplay.jsx'
import { Link } from 'react-router-dom'

export default function MessageBubble({ message, onVisualize }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-sm text-white"
          style={{ background: 'linear-gradient(135deg, #6B3FA0, #8B5CF6)', boxShadow: '0 0 12px rgba(139, 92, 246, 0.40)' }}>
          🤖
        </div>
      )}

      <div className={`max-w-[80%] flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'text-white rounded-br-sm'
              : 'text-[#E5E7EB] glass rounded-bl-sm'
          }`}
          style={isUser ? { background: 'linear-gradient(135deg, #6B3FA0, #8B5CF6)', boxShadow: '0 0 16px rgba(139, 92, 246, 0.30)' } : {}}
        >
          <MathDisplay content={message.displayContent || message.content} />
        </div>

        {/* Visualization buttons */}
        {message.vizData && (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onVisualize?.(message.vizData)}
              className="px-3 py-2 rounded-xl text-xs font-heading font-semibold border border-[#8B5CF6] text-[#A78BFA] hover:text-white transition-colors"
              style={{ background: 'rgba(139, 92, 246, 0.15)' }}
            >
              🎯 View in 3D
            </motion.button>
            <Link to="/ar">
              <button className="px-3 py-2 rounded-xl text-xs font-heading font-semibold border border-[#14B8A6] text-[#5EEAD4] hover:text-white transition-colors"
                style={{ background: 'rgba(20, 184, 166, 0.10)' }}>
                🔮 View in AR
              </button>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="w-8 h-8 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-sm text-white"
        style={{ background: 'linear-gradient(135deg, #6B3FA0, #8B5CF6)', boxShadow: '0 0 12px rgba(139, 92, 246, 0.40)' }}>
        🤖
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[#A78BFA]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  )
}
