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
      <FeatureCards />
      <TopicGrid />

      {/* Footer */}
      <footer className="text-center py-12 px-6 border-t border-white/5">
        <p className="text-white/30 text-sm font-heading">
          CalcuLens AR · See the Math. Feel the Change.
        </p>
        <p className="text-white/20 text-xs mt-1">
          Built with AI & Augmented Reality
        </p>
      </footer>
    </motion.div>
  )
}
