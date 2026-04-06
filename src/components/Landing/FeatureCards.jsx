import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📸',
    title: 'Snap & Solve',
    description: 'Snap a photo of any calculus question — AI reads, solves step-by-step, and visualizes it in 3D.',
    path: '/snap-solve',
    gradient: 'from-pink-500/20 to-rose-500/20',
    border: 'border-pink-500/20',
    tag: 'AI Vision',
  },
  {
    icon: '🎯',
    title: '3D Visualize',
    description: 'Interactive 3D modules for Limits, Derivatives, Integration, Solid of Revolution, and more.',
    path: '/visualize/solid-of-revolution',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/20',
    tag: 'Three.js',
  },
  {
    icon: '🤖',
    title: 'Ask CalcuLens',
    description: 'Chat with our AI tutor. Get instant step-by-step solutions with 3D visualizations.',
    path: '/chat',
    gradient: 'from-purple-500/20 to-violet-500/20',
    border: 'border-purple-500/20',
    tag: 'Claude AI',
  },
  {
    icon: '🔮',
    title: 'AR Experience',
    description: 'Place real 3D calculus models into your world using your phone camera. Real Augmented Reality!',
    path: '/ar',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/20',
    tag: 'WebXR',
  },
  {
    icon: '📋',
    title: 'Formula Sheet',
    description: 'All essential calculus formulas organized by topic — limits, derivatives, integrals, and applications.',
    path: '/formulas',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/20',
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
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
          Powered by AI & AR
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto">
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
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`glass h-full p-6 bg-gradient-to-br ${f.gradient} border ${f.border} hover:shadow-glow transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{f.icon}</span>
                  <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-white mb-2">{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center gap-2 text-purple-400 text-sm font-heading font-semibold">
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
