import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { drawAxes } from '../../utils/canvas-helpers.js'

const PRESETS = [
  { label: '(x²-1)/(x-1)', fn: (x) => (Math.abs(x - 1) < 0.0001 ? null : (x * x - 1) / (x - 1)), limitAt: 1, limitVal: 2, latex: '\\lim_{x \\to 1} \\frac{x^2-1}{x-1}', answer: '2', domain: [-1, 3] },
  { label: 'sin(x)/x', fn: (x) => (Math.abs(x) < 0.0001 ? null : Math.sin(x) / x), limitAt: 0, limitVal: 1, latex: '\\lim_{x \\to 0} \\frac{\\sin(x)}{x}', answer: '1', domain: [-4, 4] },
  { label: '1/x (DNE)', fn: (x) => (Math.abs(x) < 0.0001 ? null : 1 / x), limitAt: 0, limitVal: null, latex: '\\lim_{x \\to 0} \\frac{1}{x}', answer: '\\text{DNE}', domain: [-3, 3] },
  { label: '(eˣ-1)/x', fn: (x) => (Math.abs(x) < 0.0001 ? null : (Math.exp(x) - 1) / x), limitAt: 0, limitVal: 1, latex: '\\lim_{x \\to 0} \\frac{e^x - 1}{x}', answer: '1', domain: [-3, 3] },
]

const W = 800, H = 450, PAD = 50

function toCanvas(x, y, domain, yRange) {
  return [PAD + ((x - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD),
    H - PAD - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)]
}

export default function LimitsModule() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [approachX, setApproachX] = useState(0.5)
  const [autoAnimate, setAutoAnimate] = useState(false)
  const canvasRef = useRef()
  const animRef = useRef()

  const preset = PRESETS[presetIdx]
  const domain = preset.domain
  const limitAt = preset.limitAt
  const yRange = [-4, 4]
  const xLeft = limitAt - approachX
  const xRight = limitAt + approachX
  const yLeft = preset.fn(xLeft)
  const yRight = preset.fn(xRight)

  // Auto-animate approaching
  useEffect(() => {
    if (!autoAnimate) { cancelAnimationFrame(animRef.current); return }
    let val = 1.5
    const tick = () => {
      val = Math.max(val - 0.008, 0.002)
      setApproachX(val)
      if (val > 0.002) animRef.current = requestAnimationFrame(tick)
      else setAutoAnimate(false)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [autoAnimate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    // Axes with labels
    drawAxes(ctx, W, H, PAD, domain, yRange, { xLabel: 'x', yLabel: 'f(x)' })

    // Curve — thick, glowing
    ctx.strokeStyle = '#8B5CF6'
    ctx.lineWidth = 3
    ctx.shadowColor = '#8B5CF6'
    ctx.shadowBlur = 12
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= 500; i++) {
      const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
      const y = preset.fn(x)
      if (y === null || Math.abs(y) > 10) { started = false; continue }
      const [cx, cy] = toCanvas(x, y, domain, yRange)
      if (!started) { ctx.moveTo(cx, cy); started = true }
      else ctx.lineTo(cx, cy)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    // Vertical dashed line at limit point
    ctx.strokeStyle = 'rgba(196, 181, 253, 0.5)'
    ctx.lineWidth = 1; ctx.setLineDash([4, 4])
    const [lx] = toCanvas(limitAt, 0, domain, yRange)
    ctx.beginPath(); ctx.moveTo(lx, PAD); ctx.lineTo(lx, H - PAD); ctx.stroke()
    ctx.setLineDash([])

    // Approach trails
    const drawTrail = (fromX, toX, color, side) => {
      ctx.strokeStyle = color + '40'
      ctx.lineWidth = 2
      ctx.beginPath()
      const steps = 30
      let s = false
      for (let i = 0; i <= steps; i++) {
        const x = side === 'left' ? toX + (fromX - toX) * (i / steps) : toX + (fromX - toX) * (i / steps)
        const y = preset.fn(x)
        if (y === null || Math.abs(y) > 10) continue
        const [cx, cy] = toCanvas(x, y, domain, yRange)
        if (!s) { ctx.moveTo(cx, cy); s = true }
        else ctx.lineTo(cx, cy)
      }
      ctx.stroke()
    }
    if (yLeft !== null && Math.abs(yLeft) <= 10) drawTrail(limitAt - 1.5, xLeft, '#A78BFA', 'left')
    if (yRight !== null && Math.abs(yRight) <= 10) drawTrail(limitAt + 1.5, xRight, '#14B8A6', 'right')

    // Approach dots with glow
    const drawDot = (x, y, color, size) => {
      if (y === null || Math.abs(y) > 10) return
      const [cx, cy] = toCanvas(x, y, domain, yRange)
      ctx.shadowColor = color; ctx.shadowBlur = 12
      ctx.beginPath(); ctx.arc(cx, cy, size, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke()
    }
    drawDot(xLeft, yLeft, '#A78BFA', 7)
    drawDot(xRight, yRight, '#14B8A6', 7)

    // Limit point (hollow circle)
    if (preset.limitVal !== null) {
      const [cx, cy] = toCanvas(limitAt, preset.limitVal, domain, yRange)
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2)
      ctx.strokeStyle = '#FCD34D'; ctx.lineWidth = 2.5; ctx.stroke()
      ctx.fillStyle = '#0A0118'; ctx.fill()
      // Label
      ctx.fillStyle = '#FCD34D'; ctx.font = 'bold 12px monospace'
      ctx.fillText(`L = ${preset.limitVal}`, cx + 14, cy - 8)
    }
  }, [presetIdx, approachX, preset, domain, xLeft, xRight, yLeft, yRight, limitAt])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden border border-[#4A2D8C]" style={{ background: '#0A0118', boxShadow: '0 0 24px rgba(139, 92, 246, 0.20)' }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxHeight: 450 }} />
      </div>

      {/* Limit notation */}
      <div className="glass p-5 rounded-2xl">
        <BlockMathDisplay math={`${preset.latex} = ${preset.answer}`} />
      </div>

      {/* Live values */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(139, 92, 246, 0.10)', border: '1px solid rgba(167, 139, 250, 0.30)' }}>
          <p className="text-[#A78BFA] text-xs font-mono mb-1">← Left approach</p>
          <p className="text-white font-heading font-bold text-xl">
            {yLeft !== null ? yLeft.toFixed(6) : '±∞'}
          </p>
          <p className="text-[#9CA3AF] text-xs font-mono">x = {xLeft.toFixed(6)}</p>
        </div>
        <div className="p-4 rounded-2xl" style={{ background: 'rgba(20, 184, 166, 0.10)', border: '1px solid rgba(94, 234, 212, 0.30)' }}>
          <p className="text-[#5EEAD4] text-xs font-mono mb-1">Right approach →</p>
          <p className="text-white font-heading font-bold text-xl">
            {yRight !== null ? yRight.toFixed(6) : '±∞'}
          </p>
          <p className="text-[#9CA3AF] text-xs font-mono">x = {xRight.toFixed(6)}</p>
        </div>
      </div>

      {/* Approach slider */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[#9CA3AF] text-sm font-heading">Distance from x = {limitAt}</p>
          <p className="text-[#A78BFA] text-sm font-mono font-bold">δ = {approachX.toFixed(4)}</p>
        </div>
        <input type="range" min={0.001} max={1.5} step={0.001} value={approachX}
          onChange={(e) => { setAutoAnimate(false); setApproachX(Number(e.target.value)) }} className="w-full" style={{ accentColor: '#8B5CF6' }} />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => { setApproachX(1.5); setTimeout(() => setAutoAnimate(true), 100) }}
          disabled={autoAnimate} className="btn-primary flex-1 py-3 text-sm disabled:opacity-50">
          {autoAnimate ? '⟳ Approaching...' : '▶ Auto Approach'}
        </button>
      </div>

      {/* Presets */}
      <div className="glass p-4 rounded-2xl">
        <p className="text-[#9CA3AF] text-sm font-heading mb-3">Select Function</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <motion.button key={i} whileTap={{ scale: 0.95 }}
              onClick={() => { setPresetIdx(i); setApproachX(0.5); setAutoAnimate(false) }}
              className={`px-4 py-3 rounded-xl text-sm font-mono border transition-all`}
              style={presetIdx === i
                ? { background: 'rgba(139, 92, 246, 0.20)', borderColor: '#8B5CF6', borderWidth: '2px', color: '#A78BFA', boxShadow: '0 0 16px rgba(139, 92, 246, 0.30)' }
                : { background: 'rgba(139, 92, 246, 0.05)', borderColor: 'rgba(167, 139, 250, 0.20)', color: '#9CA3AF' }}>
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
