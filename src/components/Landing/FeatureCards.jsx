import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📸',
    title: 'Snap & Solve',
    description: 'Snap a photo of any calculus question — AI reads, solves step-by-step, and visualizes it in 3D.',
    path: '/snap-solve',
    bg: '#F0F7FF',
    border: '#90CAF9',
    tag: 'AI Vision',
  },
  {
    icon: '🎯',
    title: '3D Visualize',
    description: 'Interactive 3D modules for Limits, Derivatives, Integration, Solid of Revolution, and more.',
    path: '/visualize/solid-of-revolution',
    bg: '#E3F2FD',
    border: '#90CAF9',
    tag: 'Three.js',
  },
  {
    icon: '🤖',
    title: 'Ask CalcuLens',
    description: 'Chat with our AI tutor. Get instant step-by-step solutions with 3D visualizations.',
    path: '/chat',
    bg: '#F0F7FF',
    border: '#90CAF9',
    tag: 'Claude AI',
  },
  {
    icon: '🔮',
    title: 'AR Experience',
    description: 'Place real 3D calculus models into your world using your phone camera. Real Augmented Reality!',
    path: '/ar',
    bg: '#E3F2FD',
    border: '#90CAF9',
    tag: 'WebXR',
  },
  {
    icon: '📋',
    title: 'Formula Sheet',
    description: 'All essential calculus formulas organized by topic — limits, derivatives, integrals, and applications.',
    path: '/formulas',
    bg: '#F0F7FF',
    border: '#90CAF9',
    tag: 'Reference',
  },
]

export default function FeatureCards() {
  return (
    <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: '#E3F2FD', border: '1px solid #90CAF9' }}>
          <span className="text-xs font-heading font-bold text-[#1565C0] uppercase tracking-wider">✨ Features</span>
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-[#0D1B2A] mb-4">
          Powered by AI & AR
        </h2>
        <p className="text-[#64748B] text-lg max-w-xl mx-auto">
          Four powerful tools to make calculus intuitive and visual
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to={f.path} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.02, y: -4, boxShadow: '0 8px 28px rgba(21, 101, 192, 0.18)' }}
                whileTap={{ scale: 0.98 }}
                className="h-full p-6 rounded-2xl transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, #FFFFFF 0%, ${f.bg} 100%)`,
                  border: `1.5px solid ${f.border}`,
                  boxShadow: '0 4px 20px rgba(21, 101, 192, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{f.icon}</span>
                  <span className="text-xs font-mono text-[#1565C0] px-2 py-1 rounded-full" style={{ background: '#E3F2FD', border: '1px solid #BBDEFB' }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#0D1B2A] mb-2">{f.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-2 text-[#1565C0] text-sm font-heading font-semibold">
                  <span>Explore</span>
                  <span>→</span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
