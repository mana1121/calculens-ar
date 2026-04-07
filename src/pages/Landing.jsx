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

      {/* Decorative pastel divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #90CAF9 50%, transparent 100%)' }} />

      {/* Features section with pastel background */}
      <section style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%)', borderTop: '1px solid #BBDEFB', borderBottom: '1px solid #BBDEFB' }}>
        <FeatureCards />
      </section>

      {/* Decorative pastel divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, #90CAF9 50%, transparent 100%)' }} />

      {/* Topics section with subtle alt-tone background */}
      <section style={{ background: 'linear-gradient(180deg, #F8FBFF 0%, #E3F2FD 100%)', borderBottom: '1px solid #BBDEFB' }}>
        <TopicGrid />
      </section>

      {/* Footer */}
      <footer
        className="text-center py-12 px-6"
        style={{
          background: 'linear-gradient(180deg, #E3F2FD 0%, #BBDEFB 100%)',
          borderTop: '2px solid #90CAF9',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
        }}
      >
        <p className="text-[#1565C0] text-sm font-heading font-semibold">
          CalcuLens AR · See the Math. Feel the Change.
        </p>
        <p className="text-[#64748B] text-xs mt-1">
          Built with AI & Augmented Reality
        </p>
      </footer>
    </motion.div>
  )
}
