import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/Layout/PageHeader.jsx'
import ARViewer, { AR_MODELS } from '../components/AR/ARViewer.jsx'

const CATEGORIES = [
  {
    label: 'Solid of Revolution',
    subtitle: '6 models',
    keys: ['solid_paraboloid', 'solid_cone', 'solid_sphere', 'solid_sqrtx', 'solid_sinx', 'solid_reciprocal'],
  },
  {
    label: 'Area Under Curve',
    subtitle: '3 models',
    keys: ['area_x2', 'area_sinx', 'area_between'],
  },
  {
    label: 'Derivatives & Tangent',
    subtitle: '2 models',
    keys: ['tangent_parabola', 'tangent_saddle'],
  },
  {
    label: 'Optimization',
    subtitle: '1 model',
    keys: ['optimization_box'],
  },
]

export default function ARPage() {
  const [selectedTopic, setSelectedTopic] = useState('solid_paraboloid')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader title="AR Experience" subtitle="Place 3D calculus models in your world" />

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        {/* AR Viewer */}
        <div className="mb-6">
          <ARViewer selectedTopic={selectedTopic} />
        </div>

        {/* Topic selector */}
        <div className="space-y-5">
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <div className="mb-3">
                <p className="font-heading font-semibold text-[#0D1B2A] text-sm">{cat.label}</p>
                <p className="text-[#64748B] text-xs font-mono">{cat.subtitle}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {cat.keys.map((key) => {
                  const model = AR_MODELS[key]
                  const isActive = selectedTopic === key
                  return (
                    <motion.button
                      key={key}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTopic(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isActive
                          ? 'border-2 border-[#1565C0] bg-[#E3F2FD]'
                          : 'border border-[#BBDEFB] bg-[#F0F7FF] hover:border-[#90CAF9]'
                      }`}
                    >
                      <div className="text-xl mb-1">{model.icon}</div>
                      <p className={`text-xs font-heading font-medium leading-tight ${isActive ? 'text-[#1565C0]' : 'text-[#64748B]'}`}>
                        {model.title.split(':').pop()?.trim() || model.title}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
