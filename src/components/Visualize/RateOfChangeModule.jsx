import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'

const SCENARIOS = [
  {
    id: 'circle',
    label: 'Expanding Circle',
    icon: '⭕',
    desc: 'Radius grows at dr/dt = 2 m/s',
    latex: '\\frac{dA}{dt} = 2\\pi r \\cdot \\frac{dr}{dt}',
    compute: (t) => {
      const r = 1 + 2 * t
      const A = Math.PI * r * r
      const dAdt = 2 * Math.PI * r * 2
      return { r, A, rate: dAdt, labels: [`r = ${r.toFixed(2)} m`, `A = ${A.toFixed(2)} m²`, `dA/dt = ${dAdt.toFixed(2)} m²/s`] }
    },
  },
  {
    id: 'cone',
    label: 'Filling Cone',
    icon: '🔺',
    desc: 'Water fills at dV/dt = 3 m³/s',
    latex: '\\frac{dh}{dt} = \\frac{dV/dt}{\\pi r^2}',
    compute: (t) => {
      const V = 3 * t
      const r = 1
      const h = V / (Math.PI * r * r)
      const dhdt = 3 / (Math.PI * r * r)
      return { h, V, rate: dhdt, labels: [`V = ${V.toFixed(2)} m³`, `h = ${h.toFixed(2)} m`, `dh/dt = ${dhdt.toFixed(2)} m/s`] }
    },
  },
  {
    id: 'ladder',
    label: 'Sliding Ladder',
    icon: '🪜',
    desc: 'Base slides at dx/dt = 1 m/s, L=5',
    latex: '\\frac{dy}{dt} = -\\frac{x}{y} \\cdot \\frac{dx}{dt}',
    compute: (t) => {
      const L = 5
      const x = Math.min(1 + t, L - 0.5)
      const y = Math.sqrt(Math.max(0, L * L - x * x))
      const dydt = y > 0 ? -x / y : 0
      return { x, y, rate: dydt, labels: [`x = ${x.toFixed(2)} m`, `y = ${y.toFixed(2)} m`, `dy/dt = ${dydt.toFixed(2)} m/s`] }
    },
  },
]

const W = 300
const H = 280

export default function RateOfChangeModule() {
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef()
  const intervalRef = useRef()

  const scenario = SCENARIOS[scenarioIdx]
  const state = scenario.compute(t)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setT((prev) => {
          if (prev >= 3) { setPlaying(false); return prev }
          return prev + 0.05
        })
      }, 50)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    if (scenario.id === 'circle') {
      const cx = W / 2, cy = H / 2
      const r = Math.min(state.r * 25, 120)
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(102,126,234,0.2)'; ctx.fill()
      ctx.strokeStyle = '#667eea'; ctx.lineWidth = 2; ctx.stroke()
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3])
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r, cy); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = '#f59e0b'; ctx.font = '11px monospace'; ctx.textAlign = 'center'
      ctx.fillText(`r=${state.r.toFixed(2)}`, cx + r / 2, cy - 6)
    } else if (scenario.id === 'cone') {
      const baseX = W / 2, baseY = H - 30
      const maxH = 200, maxR = 80
      const h = Math.min(state.h * 40, maxH)
      const r = maxR * (h / maxH)
      ctx.beginPath(); ctx.moveTo(baseX, baseY - h)
      ctx.lineTo(baseX - r, baseY); ctx.lineTo(baseX + r, baseY); ctx.closePath()
      ctx.fillStyle = 'rgba(52,211,153,0.15)'; ctx.fill()
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.stroke()
      // Water level
      const wh = Math.min(state.h * 30, maxH * 0.9)
      const wr = maxR * (wh / maxH)
      ctx.beginPath(); ctx.moveTo(baseX - wr, baseY - wh)
      ctx.lineTo(baseX + wr, baseY - wh)
      ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke()
    } else if (scenario.id === 'ladder') {
      const ox = 40, oy = H - 30
      const scale = 35
      const x = state.x * scale, y = state.y * scale
      // Wall
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy - 200); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + 200, oy); ctx.stroke()
      // Ladder
      ctx.strokeStyle = '#f87171'; ctx.lineWidth = 4
      ctx.beginPath(); ctx.moveTo(ox + x, oy); ctx.lineTo(ox, oy - y); ctx.stroke()
      ctx.fillStyle = '#f87171'
      ctx.beginPath(); ctx.arc(ox + x, oy, 6, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(ox, oy - y, 6, 0, Math.PI * 2); ctx.fill()
      // Labels
      ctx.fillStyle = '#f59e0b80'; ctx.font = '10px monospace'
      ctx.fillText(`x=${state.x.toFixed(1)}`, ox + x / 2, oy + 15)
      ctx.fillText(`y=${state.y.toFixed(1)}`, ox - 32, oy - y / 2)
    }
  }, [t, scenario, state])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-start">
        <div className="glass rounded-2xl overflow-hidden flex-shrink-0">
          <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ maxWidth: W, maxHeight: H }} />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {state.labels.map((lbl) => (
            <div key={lbl} className="glass-dark p-3 rounded-xl">
              <p className="font-mono text-sm text-purple-300">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass p-4 rounded-2xl">
        <BlockMathDisplay math={scenario.latex} />
      </div>

      {/* Slider */}
      <div className="glass p-4 rounded-2xl">
        <div className="flex justify-between mb-2">
          <p className="text-white/50 text-xs font-heading">Time</p>
          <p className="text-purple-300 text-xs font-mono">t = {t.toFixed(2)}s</p>
        </div>
        <input type="range" min={0} max={3} step={0.01} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)) }} className="w-full accent-purple-500" />
      </div>

      <div className="flex gap-3">
        <button onClick={() => { setT(0); setPlaying(false) }} className="btn-secondary flex-1 py-3 text-sm">↩ Reset</button>
        <button onClick={() => setPlaying((p) => !p)} className="btn-primary flex-1 py-3 text-sm">
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Scenario selector */}
      <div className="flex gap-2">
        {SCENARIOS.map((s, i) => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setScenarioIdx(i); setT(0); setPlaying(false) }}
            className={`flex-1 py-3 px-2 rounded-xl text-xs font-heading border transition-all ${
              scenarioIdx === i ? 'border-purple-500/50 bg-purple-500/20 text-white' : 'border-white/10 text-white/50'
            }`}
          >
            {s.icon} {s.label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
