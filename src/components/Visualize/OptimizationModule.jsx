import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { drawAxes } from '../../utils/canvas-helpers.js'

const PRESETS = [
  {
    label: 'x³ - 3x', fn: (x) => x * x * x - 3 * x, deriv: (x) => 3 * x * x - 3, deriv2: (x) => 6 * x,
    latex: 'f(x) = x^3 - 3x', derivLatex: "f'(x) = 3x^2 - 3",
    criticals: [{ x: -1, type: 'Local Max', color: '#f87171' }, { x: 1, type: 'Local Min', color: '#34d399' }],
    domain: [-2.5, 2.5],
  },
  {
    label: 'x⁴ - 4x²', fn: (x) => x ** 4 - 4 * x * x, deriv: (x) => 4 * x ** 3 - 8 * x, deriv2: (x) => 12 * x * x - 8,
    latex: 'f(x) = x^4 - 4x^2', derivLatex: "f'(x) = 4x^3 - 8x",
    criticals: [{ x: -Math.SQRT2, type: 'Local Min', color: '#34d399' }, { x: 0, type: 'Local Max', color: '#f87171' }, { x: Math.SQRT2, type: 'Local Min', color: '#34d399' }],
    domain: [-2.5, 2.5],
  },
  {
    label: '-x² + 4x', fn: (x) => -x * x + 4 * x, deriv: (x) => -2 * x + 4, deriv2: () => -2,
    latex: 'f(x) = -x^2 + 4x', derivLatex: "f'(x) = -2x + 4",
    criticals: [{ x: 2, type: 'Absolute Max', color: '#f87171' }],
    domain: [-1, 5],
  },
]

const W = 800, H = 500, PAD = 50

function toCanvas(x, y, domain, yRange) {
  return [PAD + ((x - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD),
    H - PAD - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)]
}

export default function OptimizationModule() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [showDeriv, setShowDeriv] = useState(false)
  const [showIncDec, setShowIncDec] = useState(true)
  const canvasRef = useRef()
  const preset = PRESETS[presetIdx]
  const domain = preset.domain
  const yRange = [-6, 6]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    // Axes with labels
    drawAxes(ctx, W, H, PAD, domain, yRange, { xLabel: 'x', yLabel: 'f(x)' })

    // Increasing/decreasing shading
    if (showIncDec) {
      for (let i = 0; i < 500; i++) {
        const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
        const dx = (domain[1] - domain[0]) / 500
        const d = preset.deriv(x)
        const y = preset.fn(x)
        if (Math.abs(y) > 12) continue
        const [cx] = toCanvas(x, 0, domain, yRange)
        const [, cy] = toCanvas(x, y, domain, yRange)
        const [, baseY] = toCanvas(x, 0, domain, yRange)
        const rectW = (W - 2 * PAD) / 500
        ctx.fillStyle = d > 0 ? 'rgba(52,211,153,0.06)' : 'rgba(248,113,113,0.06)'
        ctx.fillRect(cx, Math.min(cy, baseY), rectW, Math.abs(cy - baseY))
      }
    }

    // f'(x) curve
    if (showDeriv) {
      ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4])
      ctx.beginPath(); let s = false
      for (let i = 0; i <= 500; i++) {
        const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
        const y = preset.deriv(x)
        if (Math.abs(y) > 12) { s = false; continue }
        const [cx, cy] = toCanvas(x, y, domain, yRange)
        if (!s) { ctx.moveTo(cx, cy); s = true } else ctx.lineTo(cx, cy)
      }
      ctx.stroke(); ctx.setLineDash([])
    }

    // f(x) curve — glow
    ctx.strokeStyle = '#8B5CF6'; ctx.lineWidth = 3.5
    ctx.shadowColor = '#8B5CF6'; ctx.shadowBlur = 14
    ctx.beginPath(); let started = false
    for (let i = 0; i <= 500; i++) {
      const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
      const y = preset.fn(x)
      if (Math.abs(y) > 12) { started = false; continue }
      const [cx, cy] = toCanvas(x, y, domain, yRange)
      if (!started) { ctx.moveTo(cx, cy); started = true } else ctx.lineTo(cx, cy)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    // Critical points — big glowing dots with labels
    preset.criticals.forEach(({ x, color, type }) => {
      const y = preset.fn(x)
      if (Math.abs(y) > 12) return
      const [cx, cy] = toCanvas(x, y, domain, yRange)

      // Outer glow ring
      ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2)
      ctx.fillStyle = color + '15'; ctx.fill()
      ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2)
      ctx.fillStyle = color + '25'; ctx.fill()

      // Inner dot
      ctx.shadowColor = color; ctx.shadowBlur = 15
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke()

      // Label
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 12px "Space Grotesk", sans-serif'
      ctx.fillText(type, cx + 18, cy - 12)
      ctx.fillStyle = '#9CA3AF'; ctx.font = '11px monospace'
      ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`, cx + 18, cy + 4)
    })
  }, [presetIdx, showDeriv, showIncDec, preset, domain])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden border border-[#4A2D8C]"
        style={{ background: '#0A0118', boxShadow: '0 0 24px rgba(139, 92, 246, 0.20)' }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxHeight: 500 }} />
      </div>

      <div className="glass p-4 rounded-2xl">
        <BlockMathDisplay math={`${preset.derivLatex} = 0`} />
      </div>

      {/* Critical points cards */}
      <div className="glass p-4 rounded-2xl">
        <p className="text-[#9CA3AF] text-sm font-heading mb-3">Critical Points</p>
        <div className="flex flex-wrap gap-3">
          {preset.criticals.map(({ x, type, color }) => (
            <div key={x} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ background: `${color}15`, borderColor: color, boxShadow: `0 0 12px ${color}30` }}>
              <div className="w-4 h-4 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <div>
                <p className="text-white text-sm font-heading font-semibold">{type}</p>
                <p className="text-[#9CA3AF] text-xs font-mono">x = {x.toFixed(3)}, y = {preset.fn(x).toFixed(3)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setShowDeriv((s) => !s)} className="btn-secondary py-3 text-sm">
          {showDeriv ? "Hide f'(x)" : "Show f'(x)"}
        </button>
        <button onClick={() => setShowIncDec((s) => !s)} className="btn-secondary py-3 text-sm">
          {showIncDec ? 'Hide ↑↓' : 'Show ↑↓'}
        </button>
        <div />
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => setPresetIdx(i)}
            className="flex-1 py-3 rounded-xl text-sm font-mono border transition-all"
            style={presetIdx === i
              ? { background: 'rgba(139, 92, 246, 0.20)', borderColor: '#8B5CF6', borderWidth: '2px', color: '#A78BFA', boxShadow: '0 0 16px rgba(139, 92, 246, 0.30)' }
              : { background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(167, 139, 250, 0.20)', color: '#9CA3AF' }}>
            {p.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
