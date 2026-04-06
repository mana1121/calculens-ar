import { motion } from 'framer-motion'
import { BlockMathDisplay, InlineMathDisplay } from '../Shared/MathDisplay.jsx'
import { Link } from 'react-router-dom'

export default function SolutionDisplay({ imageDataURL, result, onReset, onVisualize }) {
  if (!result) return null

  const { question_text, solution, can_visualize, topic } = result

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4"
    >
      {/* Image thumbnail + question */}
      <div className="glass p-4 rounded-2xl flex gap-3 items-start">
        {imageDataURL && (
          <img
            src={imageDataURL}
            alt="Captured"
            className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
          />
        )}
        <div>
          <p className="text-white/40 text-xs font-mono mb-1">Detected question</p>
          <p className="text-white/80 text-sm leading-relaxed">{question_text}</p>
        </div>
      </div>

      {/* Topic badge */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 glass rounded-full text-xs font-heading text-purple-300 border border-purple-500/30">
          {topic?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      </div>

      {/* Step-by-step solution */}
      <div className="space-y-3">
        {solution?.steps?.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="glass p-4 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold font-heading"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                {step.step}
              </div>
              <div className="flex-1">
                <p className="text-white/70 text-sm mb-2">{step.description}</p>
                {step.math && <BlockMathDisplay math={step.math} />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final answer */}
      {solution?.final_answer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: (solution.steps?.length || 0) * 0.1 }}
          className="glass p-5 rounded-2xl border border-purple-500/30"
          style={{ background: 'rgba(102,126,234,0.08)' }}
        >
          <p className="text-white/50 text-xs font-mono mb-2">✅ Final Answer</p>
          <BlockMathDisplay math={solution.final_answer} />
        </motion.div>
      )}

      {/* Action buttons */}
      {can_visualize && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onVisualize}
            className="btn-primary py-4 text-sm"
          >
            🎯 Visualize in 3D
          </motion.button>
          <Link to="/ar" className="block">
            <button className="btn-secondary w-full py-4 text-sm">
              🔮 View in AR
            </button>
          </Link>
        </div>
      )}

      <button onClick={onReset} className="btn-secondary py-3 text-sm">
        📸 Snap Another Question
      </button>
    </motion.div>
  )
}
