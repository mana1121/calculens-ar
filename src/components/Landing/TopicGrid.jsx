import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const topics = [
  {
    id: 'limits',
    icon: '→',
    title: 'Limits',
    subtitle: 'Calculus I',
    desc: 'Explore left/right limits and continuity',
    color: '#1565C0',
  },
  {
    id: 'derivatives',
    icon: "f'",
    title: 'Derivatives',
    subtitle: 'Calculus I',
    desc: 'Tangent lines and rate of change',
    color: '#42A5F5',
  },
  {
    id: 'integration',
    icon: '∫',
    title: 'Integration',
    subtitle: 'Calculus I & II',
    desc: 'Area under curves and Riemann sums',
    color: '#34d399',
  },
  {
    id: 'solid-of-revolution',
    icon: '⟳',
    title: 'Solid of Revolution',
    subtitle: 'Calculus II',
    desc: '3D solids formed by rotating curves',
    color: '#f59e0b',
  },
  {
    id: 'optimization',
    icon: '⬆',
    title: 'Optimization',
    subtitle: 'Calculus I & II',
    desc: 'Find maxima and minima visually',
    color: '#f87171',
  },
  {
    id: 'rate-of-change',
    icon: 'Δ',
    title: 'Rate of Change',
    subtitle: 'Calculus II',
    desc: 'Related rates with real-world scenarios',
    color: '#38bdf8',
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
        <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: '#FFFFFF', border: '1px solid #90CAF9' }}>
          <span className="text-xs font-heading font-bold text-[#1565C0] uppercase tracking-wider">📚 Topics</span>
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#0D1B2A] mb-4">
          Calculus Topics
        </h2>
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
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
                whileHover={{ scale: 1.04, y: -4, boxShadow: '0 8px 28px rgba(21, 101, 192, 0.18)' }}
                whileTap={{ scale: 0.96 }}
                className="p-5 flex flex-col gap-3 cursor-pointer group rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F7FF 100%)',
                  border: `1.5px solid ${topic.color}`,
                  boxShadow: `0 4px 20px ${topic.color}20, inset 0 1px 0 rgba(255,255,255,0.7)`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-mono font-bold"
                    style={{ background: `${topic.color}20`, color: topic.color }}
                  >
                    {topic.icon}
                  </div>
                  <span className="text-[10px] font-mono text-[#1565C0] px-2 py-1 rounded-full" style={{ background: '#E3F2FD', border: '1px solid #BBDEFB' }}>
                    {topic.subtitle}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-[#0D1B2A] text-sm">{topic.title}</h3>
                  <p className="text-[#64748B] text-xs leading-relaxed mt-1">{topic.desc}</p>
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
