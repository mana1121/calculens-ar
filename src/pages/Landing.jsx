import { motion } from 'framer-motion'
import Hero from '../components/Landing/Hero.jsx'
import FeatureCards from '../components/Landing/FeatureCards.jsx'
import TopicGrid from '../components/Landing/TopicGrid.jsx'

export default function Landing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Hero />

      {/* Decorative purple divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 50%, transparent 100%)' }} />

      {/* Features section with deep purple background */}
      <section style={{ background: 'linear-gradient(180deg, #0A0118 0%, #1A0B2E 100%)', borderTop: '1px solid rgba(139, 92, 246, 0.20)', borderBottom: '1px solid rgba(139, 92, 246, 0.20)' }}>
        <FeatureCards />
      </section>

      {/* Decorative purple divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #14B8A6 50%, transparent 100%)' }} />

      {/* Topics section */}
      <section style={{ background: 'linear-gradient(180deg, #1A0B2E 0%, #0A0118 100%)', borderBottom: '1px solid rgba(139, 92, 246, 0.20)' }}>
        <TopicGrid />
      </section>

      {/* Footer */}
      <footer
        className="text-center py-12 px-6"
        style={{
          background: 'linear-gradient(180deg, #1A0B2E 0%, #0A0118 100%)',
          borderTop: '2px solid rgba(139, 92, 246, 0.30)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <p className="text-[#A78BFA] text-sm font-heading font-semibold">
          CalcuLens AR · See the Math. Feel the Change.
        </p>
        <p className="text-[#9CA3AF] text-xs mt-1">
          Built with AI & Augmented Reality
        </p>
      </footer>
    </motion.div>
  )
}
