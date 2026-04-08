import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📸',
    title: 'Snap & Solve',
    description: 'Snap a photo of any calculus question — AI reads, solves step-by-step, and visualizes it in 3D.',
    path: '/snap-solve',
    accent: '#8B5CF6',
    tag: 'AI Vision',
  },
  {
    icon: '🎯',
    title: '3D Visualize',
    description: 'Interactive 3D modules for Limits, Derivatives, Integration, Solid of Revolution, and more.',
    path: '/visualize/solid-of-revolution',
    accent: '#A78BFA',
    tag: 'Three.js',
  },
  {
    icon: '🤖',
    title: 'Ask CalcuLens',
    description: 'Chat with our AI tutor. Get instant step-by-step solutions with 3D visualizations.',
    path: '/chat',
    accent: '#14B8A6',
    tag: 'Claude AI',
  },
  {
    icon: '🔮',
    title: 'AR Experience',
    description: 'Place real 3D calculus models into your world using your phone camera. Real Augmented Reality!',
    path: '/ar',
    accent: '#C4B5FD',
    tag: 'WebXR',
  },
  {
    icon: '📋',
    title: 'Formula Sheet',
    description: 'All essential calculus formulas organized by topic — limits, derivatives, integrals, and applications.',
    path: '/formulas',
    accent: '#2DD4BF',
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
        <div className="inline-block px-4 py-1.5 rounded-full mb-4" style={{ background: 'rgba(139, 92, 246, 0.10)', border: '1px solid rgba(167, 139, 250, 0.30)' }}>
          <span className="text-xs font-heading font-bold text-[#A78BFA] uppercase tracking-wider">✨ Features</span>
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
          Powered by AI & AR
        </h2>
        <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
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
                whileHover={{ scale: 1.02, y: -4, boxShadow: `0 8px 32px ${f.accent}33` }}
                whileTap={{ scale: 0.98 }}
                className="h-full p-6 rounded-2xl transition-all cursor-pointer glass-card"
                style={{
                  borderColor: `${f.accent}40`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{f.icon}</span>
                  <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}40`, color: f.accent }}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{f.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-heading font-semibold" style={{ color: f.accent }}>
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
