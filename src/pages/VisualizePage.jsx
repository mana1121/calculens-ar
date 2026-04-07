import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/Layout/PageHeader.jsx'
import SolidOfRevModule from '../components/Visualize/SolidOfRevModule.jsx'
import LimitsModule from '../components/Visualize/LimitsModule.jsx'
import DerivativesModule from '../components/Visualize/DerivativesModule.jsx'
import IntegrationModule from '../components/Visualize/IntegrationModule.jsx'
import OptimizationModule from '../components/Visualize/OptimizationModule.jsx'
import RateOfChangeModule from '../components/Visualize/RateOfChangeModule.jsx'
import { BlockMathDisplay } from '../components/Shared/MathDisplay.jsx'

const MODULE_MAP = {
  'solid-of-revolution': {
    component: SolidOfRevModule,
    title: 'Solid of Revolution',
    subtitle: 'Rotate curves around an axis to form 3D solids',
    questions: [
      { q: 'Find the volume of the solid formed by rotating y = x² about the x-axis from x = 0 to x = 2.', math: 'V = \\pi\\int_0^2 (x^2)^2\\,dx = \\pi\\int_0^2 x^4\\,dx = \\frac{32\\pi}{5}', difficulty: 'Medium' },
      { q: 'Find the volume of the solid formed by rotating y = √x about the x-axis from x = 0 to x = 4.', math: 'V = \\pi\\int_0^4 (\\sqrt{x})^2\\,dx = \\pi\\int_0^4 x\\,dx = 8\\pi', difficulty: 'Easy' },
      { q: 'Find the volume of the solid formed by rotating y = sin(x) about the x-axis from x = 0 to x = π.', math: 'V = \\pi\\int_0^{\\pi} \\sin^2(x)\\,dx = \\frac{\\pi^2}{2}', difficulty: 'Hard' },
      { q: "Calculate the volume of Gabriel's Horn: y = 1/x rotated about the x-axis from x = 1 to x = ∞.", math: 'V = \\pi\\int_1^{\\infty} \\frac{1}{x^2}\\,dx = \\pi', difficulty: 'Hard' },
    ],
  },
  limits: {
    component: LimitsModule,
    title: 'Limits',
    subtitle: 'Explore approaching values and continuity',
    questions: [
      { q: 'Evaluate the limit: lim as x→1 of (x² - 1)/(x - 1). Factor the numerator and simplify.', math: '\\lim_{x \\to 1} \\frac{x^2-1}{x-1} = \\lim_{x \\to 1} \\frac{(x-1)(x+1)}{x-1} = 2', difficulty: 'Easy' },
      { q: 'Evaluate the limit: lim as x→0 of sin(x)/x. Use the Squeeze Theorem or L\'Hôpital\'s Rule.', math: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', difficulty: 'Medium' },
      { q: 'Does the limit exist? Evaluate lim as x→0 of 1/x from both left and right sides.', math: '\\lim_{x \\to 0^-} \\frac{1}{x} = -\\infty, \\quad \\lim_{x \\to 0^+} \\frac{1}{x} = +\\infty \\quad \\Rightarrow \\text{DNE}', difficulty: 'Medium' },
      { q: 'Use L\'Hôpital\'s Rule to evaluate lim as x→0 of (eˣ - 1)/x.', math: "\\lim_{x \\to 0} \\frac{e^x - 1}{x} \\stackrel{L'H}{=} \\lim_{x \\to 0} \\frac{e^x}{1} = 1", difficulty: 'Hard' },
    ],
  },
  derivatives: {
    component: DerivativesModule,
    title: 'Derivatives',
    subtitle: 'Tangent lines, slopes, and rates of change',
    questions: [
      { q: 'Find the derivative of f(x) = x³ - 3x and determine the slope of the tangent line at x = 2.', math: "f'(x) = 3x^2 - 3, \\quad f'(2) = 3(4) - 3 = 9", difficulty: 'Easy' },
      { q: 'Find the equation of the tangent line to y = x² at the point (1, 1).', math: "y' = 2x,\\; m = 2 \\Rightarrow y - 1 = 2(x - 1) \\Rightarrow y = 2x - 1", difficulty: 'Medium' },
      { q: 'Use the Chain Rule to find the derivative of f(x) = sin(x²).', math: "f'(x) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)", difficulty: 'Medium' },
      { q: 'Find all points where the tangent line to y = x³ - 6x² + 9x is horizontal.', math: "y' = 3x^2 - 12x + 9 = 3(x-1)(x-3) = 0 \\Rightarrow x = 1, \\; x = 3", difficulty: 'Hard' },
    ],
  },
  integration: {
    component: IntegrationModule,
    title: 'Integration',
    subtitle: 'Area under curves and Riemann sums',
    questions: [
      { q: 'Evaluate the definite integral ∫₀² x² dx using the Fundamental Theorem of Calculus.', math: '\\int_0^2 x^2\\,dx = \\left[\\frac{x^3}{3}\\right]_0^2 = \\frac{8}{3}', difficulty: 'Easy' },
      { q: 'Find the area under y = sin(x) from x = 0 to x = π.', math: '\\int_0^{\\pi} \\sin x\\,dx = [-\\cos x]_0^{\\pi} = -(-1) - (-1) = 2', difficulty: 'Medium' },
      { q: 'Use integration by parts to evaluate ∫ x·eˣ dx.', math: '\\int x e^x\\,dx = x e^x - \\int e^x\\,dx = x e^x - e^x + C = e^x(x-1) + C', difficulty: 'Hard' },
      { q: 'Approximate ∫₀² x² dx using a left Riemann sum with n = 4 rectangles.', math: 'L_4 = \\sum_{i=0}^{3} f(x_i)\\Delta x = 0.5(0 + 0.25 + 1 + 2.25) = 1.75', difficulty: 'Medium' },
    ],
  },
  optimization: {
    component: OptimizationModule,
    title: 'Optimization',
    subtitle: 'Find local maxima, minima, and critical points',
    questions: [
      { q: 'Find the critical points of f(x) = x³ - 3x and classify them as local max or local min.', math: "f'(x) = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1.\\; f''(-1) < 0 \\text{ (max)},\\; f''(1) > 0 \\text{ (min)}", difficulty: 'Medium' },
      { q: 'A farmer has 100m of fencing. What dimensions maximize the area of a rectangular pen?', math: 'A = x(50-x),\\; A\'= 50-2x = 0 \\Rightarrow x = 25.\\; \\text{Max area} = 625\\,m^2', difficulty: 'Medium' },
      { q: 'Find the absolute maximum and minimum of f(x) = x⁴ - 4x² on the interval [-3, 3].', math: "f'(x) = 4x^3 - 8x = 4x(x^2-2) = 0 \\Rightarrow x = 0, \\pm\\sqrt{2}", difficulty: 'Hard' },
    ],
  },
  'rate-of-change': {
    component: RateOfChangeModule,
    title: 'Rate of Change',
    subtitle: 'Related rates with real-world scenarios',
    questions: [
      { q: 'A circle\'s radius is increasing at 2 m/s. How fast is the area increasing when the radius is 5 m?', math: '\\frac{dA}{dt} = 2\\pi r \\cdot \\frac{dr}{dt} = 2\\pi(5)(2) = 20\\pi \\approx 62.83\\; m^2/s', difficulty: 'Easy' },
      { q: 'A 5m ladder slides down a wall. The base moves at 1 m/s. How fast is the top falling when the base is 3m from the wall?', math: '2x\\frac{dx}{dt} + 2y\\frac{dy}{dt} = 0 \\Rightarrow \\frac{dy}{dt} = -\\frac{x}{y}\\cdot\\frac{dx}{dt} = -\\frac{3}{4}\\; m/s', difficulty: 'Medium' },
      { q: 'Water is poured into a cone (radius 3m, height 6m) at 2 m³/min. How fast is the water level rising when h = 2m?', math: 'V = \\frac{\\pi}{12}h^3,\\; \\frac{dV}{dt} = \\frac{\\pi}{4}h^2\\frac{dh}{dt} \\Rightarrow \\frac{dh}{dt} = \\frac{2}{\\pi} \\approx 0.64\\; m/min', difficulty: 'Hard' },
    ],
  },
}

const DIFF_COLORS = { Easy: '#34d399', Medium: '#f59e0b', Hard: '#f87171' }

export default function VisualizePage() {
  const { topic } = useParams()
  const config = MODULE_MAP[topic]
  const [showQuestions, setShowQuestions] = useState(false)
  const [expandedQ, setExpandedQ] = useState(null)

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#64748B]">Topic not found.</p>
      </div>
    )
  }

  const Module = config.component

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader title={config.title} subtitle={config.subtitle} />

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        <Module />

        {/* Practice Questions Button */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowQuestions((s) => !s)}
          className="w-full mt-6 py-4 rounded-2xl text-base font-heading font-semibold border transition-all flex items-center justify-center gap-2"
          style={showQuestions
            ? { background: '#E3F2FD', borderColor: '#1565C0', borderWidth: '2px', color: '#1565C0' }
            : { background: '#F0F7FF', borderColor: '#BBDEFB', borderWidth: '1px', color: '#1565C0' }
          }
        >
          <span className="text-xl">📝</span>
          {showQuestions ? 'Hide Practice Questions' : `Practice Questions (${config.questions.length})`}
        </motion.button>

        {/* Questions Panel */}
        <AnimatePresence>
          {showQuestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4 space-y-3"
            >
              {config.questions.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  {/* Question */}
                  <button
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    className="w-full p-5 text-left flex items-start gap-4 hover:bg-[#E3F2FD]/40 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm font-bold font-heading text-white"
                      style={{ background: '#1565C0' }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#0D1B2A] text-sm leading-relaxed">{item.q}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{ background: `${DIFF_COLORS[item.difficulty]}20`, color: DIFF_COLORS[item.difficulty] }}
                        >
                          {item.difficulty}
                        </span>
                        <span className="text-[#64748B] text-xs">
                          {expandedQ === i ? '▲ Hide solution' : '▼ Show solution'}
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Solution */}
                  <AnimatePresence>
                    {expandedQ === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 border-t border-[#BBDEFB]">
                          <div className="mt-4 p-4 rounded-xl" style={{ background: '#E3F2FD' }}>
                            <p className="text-[#1565C0] text-xs font-mono mb-2">Solution</p>
                            <BlockMathDisplay math={item.math} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
