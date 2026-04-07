import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { drawAxes } from '../../utils/canvas-helpers.js'

const PRESETS = [
  { label: 'x²', fn: (x) => x * x, deriv: (x) => 2 * x, latex: 'f(x) = x^2', derivLatex: "f'(x) = 2x", domain: [-3, 3] },
  { label: 'sin(x)', fn: (x) => Math.sin(x), deriv: (x) => Math.cos(x), latex: 'f(x) = \\sin(x)', derivLatex: "f'(x) = \\cos(x)", domain: [-Math.PI * 1.5, Math.PI * 1.5] },
  { label: 'x³-3x', fn: (x) => x * x * x - 3 * x, deriv: (x) => 3 * x * x - 3, latex: 'f(x) = x^3 - 3x', derivLatex: "f'(x) = 3x^2 - 3", domain: [-2.5, 2.5] },
  { label: 'eˣ', fn: (x) => Math.exp(x), deriv: (x) => Math.exp(x), latex: 'f(x) = e^x', derivLatex: "f'(x) = e^x", domain: [-2, 2] },
]

const W = 800, H = 500, PAD = 50

function toCanvas(x, y, domain, yRange) {
  return [PAD + ((x - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD),
    H - PAD - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)]
}

export default function DerivativesModule() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [pointX, setPointX] = useState(1)
  const [showDeriv, setShowDeriv] = useState(true)
  const [sweeping, setSweeping] = useState(false)
  const canvasRef = useRef()
  const animRef = useRef()

  const preset = PRESETS[presetIdx]
  const domain = preset.domain
  const yRange = [-4, 4]
  const slope = preset.deriv(pointX)
  const fy = preset.fn(pointX)

  // Auto sweep animation
  useEffect(() => {
    if (!sweeping) return
    let x = domain[0] + 0.2
    const tick = () => {
      x += 0.03
      if (x >= domain[1] - 0.2) { setSweeping(false); return }
      setPointX(x)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [sweeping, domain])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    // Axes with labels
    drawAxes(ctx, W, H, PAD, domain, yRange, { xLabel: 'x', yLabel: 'f(x)' })

    // f'(x) curve
    if (showDeriv) {
      ctx.strokeStyle = 'rgba(52,211,153,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([6, 4])
      ctx.beginPath()
      let s = false
      for (let i = 0; i <= 500; i++) {
        const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
        const y = preset.deriv(x)
        if (Math.abs(y) > 8) { s = false; continue }
        const [cx, cy] = toCanvas(x, y, domain, yRange)
        if (!s) { ctx.moveTo(cx, cy); s = true } else ctx.lineTo(cx, cy)
      }
      ctx.stroke(); ctx.setLineDash([])
    }

    // f(x) curve — thick glow
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 3.5
    ctx.shadowColor = '#1565C0'; ctx.shadowBlur = 10
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= 500; i++) {
      const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
      const y = preset.fn(x)
      if (Math.abs(y) > 8) { started = false; continue }
      const [cx, cy] = toCanvas(x, y, domain, yRange)
      if (!started) { ctx.moveTo(cx, cy); started = true } else ctx.lineTo(cx, cy)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    // Tangent line — long, bright
    const tLen = (domain[1] - domain[0]) * 0.35
    const tx0 = pointX - tLen, tx1 = pointX + tLen
    const ty0 = fy + slope * (tx0 - pointX), ty1 = fy + slope * (tx1 - pointX)
    const [cx0, cy0] = toCanvas(tx0, ty0, domain, yRange)
    const [cx1, cy1] = toCanvas(tx1, ty1, domain, yRange)

    // Tangent glow
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 15
    ctx.beginPath(); ctx.moveTo(cx0, cy0); ctx.lineTo(cx1, cy1); ctx.stroke()
    ctx.shadowBlur = 0

    // Point on curve — big glowing dot
    const [pcx, pcy] = toCanvas(pointX, fy, domain, yRange)
    ctx.shadowColor = '#f59e0b'; ctx.shadowBlur = 20
    ctx.beginPath(); ctx.arc(pcx, pcy, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#f59e0b'; ctx.fill()
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.5; ctx.stroke()

    // Slope label near point
    ctx.fillStyle = '#0D1B2A'; ctx.font = 'bold 13px monospace'
    ctx.fillText(`m = ${slope.toFixed(2)}`, pcx + 16, pcy - 16)
  }, [presetIdx, pointX, showDeriv, preset, domain, slope, fy])

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden border border-[#BBDEFB]"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 12px rgba(21,101,192,0.08)' }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxHeight: 500 }} />
      </div>

      {/* Slope display */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 rounded-2xl" style={{ background: '#E3F2FD' }}>
          <BlockMathDisplay math={preset.derivLatex} />
        </div>
        <div className="glass p-4 rounded-2xl flex flex-col items-end justify-center">
          <p className="text-[#64748B] text-xs font-mono">Slope at x = {pointX.toFixed(2)}</p>
          <p className="font-heading font-bold text-3xl text-amber-500">{slope.toFixed(3)}</p>
          <p className="text-[#64748B] text-xs font-mono">f({pointX.toFixed(2)}) = {fy.toFixed(3)}</p>
        </div>
      </div>

      {/* Slider */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex justify-between mb-2">
          <p className="text-[#64748B] text-sm font-heading">Move point along curve</p>
          <p className="text-amber-500 text-sm font-mono font-bold">x = {pointX.toFixed(2)}</p>
        </div>
        <input type="range" min={domain[0] + 0.15} max={domain[1] - 0.15} step={0.02} value={pointX}
          onChange={(e) => { setSweeping(false); setPointX(Number(e.target.value)) }} className="w-full" style={{ accentColor: '#f59e0b' }} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => { setPointX(domain[0] + 0.2); setTimeout(() => setSweeping(true), 50) }}
          disabled={sweeping} className="btn-primary py-3 text-sm disabled:opacity-50">
          {sweeping ? '⟳ Sweeping...' : '▶ Sweep Tangent'}
        </button>
        <button onClick={() => setShowDeriv((s) => !s)} className="btn-secondary py-3 text-sm">
          {showDeriv ? "Hide f'(x)" : "Show f'(x)"}
        </button>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map((p, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }}
            onClick={() => { setPresetIdx(i); setPointX(0); setSweeping(false) }}
            className={`flex-1 py-3 rounded-xl text-sm font-mono border transition-all ${
              presetIdx === i ? 'border-2 border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]' : 'border-[#BBDEFB] bg-[#F0F7FF] text-[#64748B]'
            }`}>
            {p.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
