import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { drawAxes } from '../../utils/canvas-helpers.js'

const PRESETS = [
  { label: 'x²', fn: (x) => x * x, latex: 'x^2', domain: [0, 2], exact: '\\frac{8}{3}', exactVal: 8 / 3 },
  { label: 'sin(x)', fn: (x) => Math.sin(x), latex: '\\sin(x)', domain: [0, Math.PI], exact: '2', exactVal: 2 },
  { label: '2x+1', fn: (x) => 2 * x + 1, latex: '2x+1', domain: [0, 3], exact: '12', exactVal: 12 },
  { label: 'eˣ', fn: (x) => Math.exp(x), latex: 'e^x', domain: [0, 1], exact: 'e-1', exactVal: Math.E - 1 },
  { label: '√x', fn: (x) => Math.sqrt(Math.max(0, x)), latex: '\\sqrt{x}', domain: [0, 4], exact: '\\frac{16}{3}', exactVal: 16 / 3 },
]

const W = 800, H = 450, PAD = 50

function toCanvas(x, y, domain, yRange) {
  return [PAD + ((x - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD),
    H - PAD - ((y - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)]
}

function riemannSum(fn, a, b, n, method) {
  const dx = (b - a) / n
  let sum = 0
  for (let i = 0; i < n; i++) {
    const x = method === 'left' ? a + i * dx : method === 'right' ? a + (i + 1) * dx : a + (i + 0.5) * dx
    sum += fn(x) * dx
  }
  return sum
}

export default function IntegrationModule() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [n, setN] = useState(5)
  const [method, setMethod] = useState('midpoint')
  const [autoAnimate, setAutoAnimate] = useState(false)
  const canvasRef = useRef()
  const animRef = useRef()

  const preset = PRESETS[presetIdx]
  const domain = preset.domain
  const [a, b] = domain
  const yMax = Math.max(...Array.from({ length: 100 }, (_, i) => preset.fn(a + (b - a) * i / 100)))
  const yRange = [0, yMax * 1.3]
  const approx = riemannSum(preset.fn, a, b, n, method)
  const errorPct = ((Math.abs(approx - preset.exactVal) / preset.exactVal) * 100)

  // Auto-animate n from 1 to 100
  useEffect(() => {
    if (!autoAnimate) return
    let val = 1
    const tick = () => {
      val = Math.min(val + 1, 100)
      setN(val)
      if (val < 100) animRef.current = requestAnimationFrame(() => setTimeout(tick, 30))
      else setAutoAnimate(false)
    }
    tick()
    return () => cancelAnimationFrame(animRef.current)
  }, [autoAnimate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    // Axes with labels
    drawAxes(ctx, W, H, PAD, domain, yRange, { xLabel: 'x', yLabel: 'f(x)' })

    // Rectangles
    const dx = (b - a) / n
    for (let i = 0; i < n; i++) {
      const xSample = method === 'left' ? a + i * dx : method === 'right' ? a + (i + 1) * dx : a + (i + 0.5) * dx
      const h = preset.fn(xSample)
      const [rx, ry] = toCanvas(a + i * dx, Math.max(0, h), domain, yRange)
      const [rxEnd] = toCanvas(a + (i + 1) * dx, 0, domain, yRange)
      const [, ryBase] = toCanvas(0, 0, domain, yRange)
      const rectW = rxEnd - rx
      const rectH = Math.abs(ry - ryBase)

      // Gradient fill per bar
      const t = i / n
      const hue = 140 + t * 80 // green to teal
      ctx.fillStyle = `hsla(${hue}, 60%, 50%, 0.35)`
      ctx.fillRect(rx, ry, rectW, rectH)
      ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.7)`
      ctx.lineWidth = 1
      ctx.strokeRect(rx, ry, rectW, rectH)
    }

    // Curve — thick glow
    ctx.strokeStyle = '#1565C0'; ctx.lineWidth = 3
    ctx.shadowColor = '#1565C0'; ctx.shadowBlur = 8
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= 500; i++) {
      const x = domain[0] + (domain[1] - domain[0]) * (i / 500)
      const y = preset.fn(x)
      if (y < 0 || y > yRange[1] + 2) { started = false; continue }
      const [cx, cy] = toCanvas(x, y, domain, yRange)
      if (!started) { ctx.moveTo(cx, cy); started = true }
      else ctx.lineTo(cx, cy)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    // Filled area under curve (subtle)
    ctx.fillStyle = 'rgba(21,101,192,0.10)'
    ctx.beginPath()
    const [startX, startY] = toCanvas(a, 0, domain, yRange)
    ctx.moveTo(startX, startY)
    for (let i = 0; i <= 200; i++) {
      const x = a + (b - a) * (i / 200)
      const [cx, cy] = toCanvas(x, preset.fn(x), domain, yRange)
      ctx.lineTo(cx, cy)
    }
    const [endX, endY] = toCanvas(b, 0, domain, yRange)
    ctx.lineTo(endX, endY)
    ctx.closePath()
    ctx.fill()
  }, [presetIdx, n, method, preset, domain, a, b, yRange])

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-2xl overflow-hidden" style={{ background: '#FFFFFF' }}>
        <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxHeight: 450 }} />
      </div>

      {/* Area values */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass p-4 rounded-2xl">
          <p className="text-[#64748B] text-xs font-mono mb-1">Riemann ({method})</p>
          <p className="font-heading font-bold text-xl text-emerald-600">{approx.toFixed(4)}</p>
        </div>
        <div className="glass p-4 rounded-2xl">
          <p className="text-[#64748B] text-xs font-mono mb-1">Exact Value</p>
          <p className="font-heading font-bold text-xl text-[#1565C0]">{preset.exactVal.toFixed(4)}</p>
        </div>
        <div className="glass p-4 rounded-2xl">
          <p className="text-[#64748B] text-xs font-mono mb-1">Error</p>
          <p className={`font-heading font-bold text-xl ${errorPct < 1 ? 'text-emerald-600' : errorPct < 5 ? 'text-amber-500' : 'text-red-500'}`}>
            {errorPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Formula */}
      <div className="glass p-4 rounded-2xl" style={{ background: '#E3F2FD' }}>
        <BlockMathDisplay math={`\\int_{${a}}^{${Number(b).toFixed(2)}} ${preset.latex}\\,dx = ${preset.exact} \\approx ${preset.exactVal.toFixed(4)}`} />
      </div>

      {/* n slider */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex justify-between mb-2">
          <p className="text-[#64748B] text-sm font-heading">Rectangles (n)</p>
          <p className="text-emerald-600 text-sm font-mono font-bold">n = {n}</p>
        </div>
        <input type="range" min={1} max={100} step={1} value={n}
          onChange={(e) => { setAutoAnimate(false); setN(Number(e.target.value)) }} className="w-full" style={{ accentColor: '#10b981' }} />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button onClick={() => { setN(1); setTimeout(() => setAutoAnimate(true), 100) }}
          disabled={autoAnimate} className="btn-primary flex-1 py-3 text-sm disabled:opacity-50">
          {autoAnimate ? '⟳ Converging...' : '▶ Animate Convergence'}
        </button>
        {['left', 'midpoint', 'right'].map((m) => (
          <motion.button key={m} whileTap={{ scale: 0.95 }} onClick={() => setMethod(m)}
            className={`flex-1 py-3 rounded-xl text-sm font-heading font-semibold border transition-all ${
              method === m ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-[#BBDEFB] bg-[#F0F7FF] text-[#64748B]'
            }`}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => { setPresetIdx(i); setN(5) }}
            className={`px-4 py-2 rounded-xl text-sm font-mono border transition-all ${
              presetIdx === i ? 'border-2 border-[#1565C0] bg-[#E3F2FD] text-[#1565C0]' : 'border-[#BBDEFB] bg-[#F0F7FF] text-[#64748B]'
            }`}>
            {p.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
