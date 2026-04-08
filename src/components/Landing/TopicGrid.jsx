import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const topics = [
  {
    id: 'limits',
    icon: '→',
    title: 'Limits',
    subtitle: 'Calculus I',
    desc: 'Explore left/right limits and continuity',
    color: '#8B5CF6',
  },
  {
    id: 'derivatives',
    icon: "f'",
    title: 'Derivatives',
    subtitle: 'Calculus I',
    desc: 'Tangent lines and rate of change',
    color: '#A78BFA',
  },
  {
    id: 'integration',
    icon: '∫',
    title: 'Integration',
    subtitle: 'Calculus I & II',
    desc: 'Area under curves and Riemann sums',
    color: '#14B8A6',
  },
  {
    id: 'solid-of-revolution',
    icon: '⟳',
    title: 'Solid of Revolution',
    subtitle: 'Calculus II',
    desc: '3D solids formed by rotating curves',
    color: '#C4B5FD',
  },
  {
    id: 'optimization',
    icon: '⬆',
    title: 'Optimization',
    subtitle: 'Calculus I & II',
    desc: 'Find maxima and minima visually',
    color: '#2DD4BF',
  },
  {
    id: 'rate-of-change',
    icon: 'Δ',
    title: 'Rate of Change',
    subtitle: 'Calculus II',
    desc: 'Related rates with real-world scenarios',
    color: '#5EEAD4',
  },
]

export default function TopicGrid() {
  return (
    <section className="px-6 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(20, 184, 166, 0.10)', border: '1px solid rgba(94, 234, 212, 0.30)' }}>
          <span className="text-xs font-heading font-bold text-[#5EEAD4] uppercase tracking-wider">📚 Topics</span>
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
          Calculus Topics
        </h2>
        <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
          All major calculus topics covered with interactive 3D visualizations
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link to={`/visualize/${topic.id}`}>
              <motion.div
                whileHover={{ scale: 1.04, y: -4, boxShadow: `0 8px 32px ${topic.color}40` }}
                whileTap={{ scale: 0.96 }}
                className="p-5 flex flex-col gap-3 cursor-pointer group rounded-2xl glass-card"
                style={{
                  borderColor: `${topic.color}40`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-bold"
                    style={{ background: `${topic.color}20`, color: topic.color, boxShadow: `0 0 16px ${topic.color}30` }}
                  >
                    {topic.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded-full" style={{ background: `${topic.color}15`, border: `1px solid ${topic.color}40`, color: topic.color }}>
                    {topic.subtitle}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white text-sm">{topic.title}</h3>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed mt-1">{topic.desc}</p>
                </div>
                <div
                  className="text-xs font-heading font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: topic.color }}
                >
                  Visualize →
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
