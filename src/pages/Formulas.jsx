import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/Layout/PageHeader.jsx'
import { BlockMathDisplay } from '../components/Shared/MathDisplay.jsx'

const CATEGORIES = [
  {
    name: 'Limits',
    icon: '→',
    color: '#8B5CF6',
    formulas: [
      { title: 'Limit Definition', math: '\\lim_{x \\to a} f(x) = L' },
      { title: "L'Hôpital's Rule", math: "\\lim_{x \\to a} \\frac{f(x)}{g(x)} = \\lim_{x \\to a} \\frac{f'(x)}{g'(x)}" },
      { title: 'Special Limit', math: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
      { title: 'Exponential Limit', math: '\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1' },
      { title: 'Squeeze Theorem', math: 'g(x) \\leq f(x) \\leq h(x) \\Rightarrow \\lim f = \\lim g = \\lim h' },
    ],
  },
  {
    name: 'Derivatives',
    icon: "f'",
    color: '#A78BFA',
    formulas: [
      { title: 'Power Rule', math: '\\frac{d}{dx} x^n = nx^{n-1}' },
      { title: 'Product Rule', math: '(fg)\' = f\'g + fg\'' },
      { title: 'Quotient Rule', math: '\\left(\\frac{f}{g}\\right)\' = \\frac{f\'g - fg\'}{g^2}' },
      { title: 'Chain Rule', math: '\\frac{d}{dx} f(g(x)) = f\'(g(x)) \\cdot g\'(x)' },
      { title: 'Trig Derivatives', math: '\\frac{d}{dx}\\sin x = \\cos x, \\quad \\frac{d}{dx}\\cos x = -\\sin x' },
      { title: 'Exponential', math: '\\frac{d}{dx} e^x = e^x, \\quad \\frac{d}{dx} \\ln x = \\frac{1}{x}' },
    ],
  },
  {
    name: 'Integration',
    icon: '∫',
    color: '#14B8A6',
    formulas: [
      { title: 'Power Rule', math: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\quad n \\neq -1' },
      { title: 'Fundamental Theorem', math: '\\int_a^b f(x)\\,dx = F(b) - F(a)' },
      { title: 'Integration by Parts', math: '\\int u\\,dv = uv - \\int v\\,du' },
      { title: 'Substitution', math: '\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du' },
      { title: 'Trig Integrals', math: '\\int \\sin x\\,dx = -\\cos x + C' },
      { title: 'Exponential', math: '\\int e^x\\,dx = e^x + C' },
    ],
  },
  {
    name: 'Applications',
    icon: '⟳',
    color: '#f59e0b',
    formulas: [
      { title: 'Area Under Curve', math: 'A = \\int_a^b f(x)\\,dx' },
      { title: 'Area Between Curves', math: 'A = \\int_a^b [f(x) - g(x)]\\,dx' },
      { title: 'Disc Method', math: 'V = \\pi\\int_a^b [f(x)]^2\\,dx' },
      { title: 'Shell Method', math: 'V = 2\\pi\\int_a^b x \\cdot f(x)\\,dx' },
      { title: 'Arc Length', math: 'L = \\int_a^b \\sqrt{1 + [f\'(x)]^2}\\,dx' },
      { title: 'Surface Area', math: 'S = 2\\pi\\int_a^b f(x)\\sqrt{1 + [f\'(x)]^2}\\,dx' },
    ],
  },
]

export default function Formulas() {
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader title="Formula Sheet" subtitle="Essential calculus formulas at your fingertips" />

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(i)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-heading font-semibold border transition-all flex items-center gap-2 ${
                activeCategory === i
                  ? 'border-2'
                  : 'border'
              }`}
              style={activeCategory === i
                ? { background: `${cat.color}20`, borderColor: cat.color, color: cat.color, boxShadow: `0 0 16px ${cat.color}30` }
                : { background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(167, 139, 250, 0.20)', color: '#9CA3AF' }}
            >
              <span className="font-mono">{cat.icon}</span>
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Formulas */}
        <div className="space-y-3">
          {CATEGORIES[activeCategory].formulas.map((formula, i) => (
            <motion.div
              key={formula.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass p-5 rounded-2xl"
              style={{ borderLeft: `3px solid ${CATEGORIES[activeCategory].color}` }}
            >
              <p className="text-[#A78BFA] text-xs font-heading font-semibold mb-3 uppercase tracking-wider">
                {formula.title}
              </p>
              <BlockMathDisplay math={formula.math} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
