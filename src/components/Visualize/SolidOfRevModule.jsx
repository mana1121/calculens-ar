import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { Link } from 'react-router-dom'

const PRESETS = [
  { label: 'y = x²', fn: (x) => x * x, fnStr: 'x^2', bounds: [0, 2], volume: '\\frac{32\\pi}{5} \\approx 20.11', color: '#1565C0' },
  { label: 'y = x', fn: (x) => x, fnStr: 'x', bounds: [0, 3], volume: '9\\pi \\approx 28.27', color: '#42A5F5' },
  { label: 'y = √x', fn: (x) => Math.sqrt(Math.max(0, x)), fnStr: '\\sqrt{x}', bounds: [0, 4], volume: '8\\pi \\approx 25.13', color: '#34d399' },
  { label: 'y = sin(x)', fn: (x) => Math.sin(x), fnStr: '\\sin(x)', bounds: [0, Math.PI], volume: '\\frac{\\pi^2}{2} \\approx 4.93', color: '#f59e0b' },
  { label: 'y = 1/x', fn: (x) => 1 / x, fnStr: '\\frac{1}{x}', bounds: [1, 3], volume: '\\frac{2\\pi}{3} \\approx 2.09', color: '#f87171' },
]

// 2D curve in world space — standard math: x along X-axis, f(x) along Y-axis
function CurvePreview({ fn, bounds }) {
  const [a, b] = bounds

  const curveGeo = useMemo(() => {
    const curvePts = []
    for (let i = 0; i <= 100; i++) {
      const x = a + (b - a) * (i / 100)
      const y = fn(x)
      curvePts.push(new THREE.Vector3(x, y, 0))
    }
    const curve = new THREE.CatmullRomCurve3(curvePts)
    return new THREE.TubeGeometry(curve, 100, 0.045, 8, false)
  }, [fn, a, b])

  return (
    <mesh geometry={curveGeo}>
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
    </mesh>
  )
}

// 3D solid of revolution — revolves the curve y=f(x) around the X axis
// Surface: (x, f(x)·cos(θ), f(x)·sin(θ)) for x in [a,b], θ in [0, sweepAngle]
function Solid({ fn, bounds, sweepAngle, color, wireframe }) {
  const [a, b] = bounds

  const geo = useMemo(() => {
    const N = 100
    const M = 64
    const positions = []
    const indices = []

    for (let i = 0; i <= N; i++) {
      const x = a + (b - a) * (i / N)
      const r = Math.max(0, fn(x))
      for (let j = 0; j <= M; j++) {
        const theta = (j / M) * sweepAngle
        const y = r * Math.cos(theta)
        const z = r * Math.sin(theta)
        positions.push(x, y, z)
      }
    }

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const v0 = i * (M + 1) + j
        const v1 = v0 + 1
        const v2 = (i + 1) * (M + 1) + j
        const v3 = v2 + 1
        indices.push(v0, v2, v1)
        indices.push(v1, v2, v3)
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    g.setIndex(indices)
    g.computeVertexNormals()
    return g
  }, [fn, a, b, sweepAngle])

  return (
    <group>
      {/* Main solid */}
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          envMapIntensity={0.8}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Wireframe overlay */}
      {wireframe && (
        <mesh geometry={geo}>
          <meshBasicMaterial color="#1565C0" wireframe transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// 3D Axes — thick, dark, bold (visible on white)
function Axes3D({ size = 4 }) {
  const axisData = [
    { dir: [1, 0, 0], label: 'X' },
    { dir: [0, 1, 0], label: 'Y' },
    { dir: [0, 0, 1], label: 'Z' },
  ]

  const axisColor = '#0D1B2A'

  return (
    <group>
      {axisData.map(({ dir, label }) => {
        const end = dir.map((d) => d * size)
        const negEnd = dir.map((d) => d * -size * 0.3)
        const startV = new THREE.Vector3(...negEnd)
        const endV = new THREE.Vector3(...end)
        const path = new THREE.LineCurve3(startV, endV)

        return (
          <group key={label}>
            {/* Thick tube axis */}
            <mesh>
              <tubeGeometry args={[path, 1, 0.035, 8, false]} />
              <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.1} transparent opacity={0.9} />
            </mesh>
            {/* Arrow cone at end */}
            <mesh position={end}
              rotation={dir[0] === 1 ? [0, 0, -Math.PI / 2] : dir[2] === 1 ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
              <coneGeometry args={[0.08, 0.25, 8]} />
              <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.1} />
            </mesh>
            {/* Label */}
            <Text
              position={end.map((e) => e * 1.12)}
              fontSize={0.4}
              color={axisColor}
              anchorX="center"
              anchorY="middle"
              font={undefined}
              fontWeight="bold"
            >
              {label}
            </Text>
            {/* Tick marks + numbers */}
            {Array.from({ length: Math.floor(size) }, (_, i) => {
              const val = i + 1
              const pos = dir.map((d) => d * val)
              // Tick bar perpendicular to axis
              const tickDir = dir[0] === 1 ? [0, 0.1, 0] : dir[1] === 1 ? [0.1, 0, 0] : [0, 0.1, 0]
              const t1 = new THREE.Vector3(pos[0] - tickDir[0], pos[1] - tickDir[1], pos[2] - tickDir[2])
              const t2 = new THREE.Vector3(pos[0] + tickDir[0], pos[1] + tickDir[1], pos[2] + tickDir[2])
              const tickPath = new THREE.LineCurve3(t1, t2)
              return (
                <group key={val}>
                  <mesh>
                    <tubeGeometry args={[tickPath, 1, 0.02, 4, false]} />
                    <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.05} transparent opacity={0.7} />
                  </mesh>
                  <Text
                    position={[pos[0] + (dir[0] === 1 ? 0 : -0.2), pos[1] + (dir[1] === 1 ? 0 : -0.2), pos[2] + (dir[2] === 1 ? 0.2 : 0)]}
                    fontSize={0.2}
                    color="#64748B"
                    anchorX="center"
                    anchorY="top"
                    font={undefined}
                  >
                    {val.toString()}
                  </Text>
                </group>
              )
            })}
          </group>
        )
      })}
      {/* Origin */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#1565C0" emissive="#1565C0" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[-0.2, -0.25, 0]} fontSize={0.22} color="#64748B" font={undefined}>
        O
      </Text>
      {/* Grid on ground plane */}
      {Array.from({ length: Math.floor(size) * 2 + 1 }, (_, i) => {
        const val = i - Math.floor(size)
        const p1a = new THREE.Vector3(val, 0, -size * 0.3)
        const p1b = new THREE.Vector3(val, 0, size)
        const p2a = new THREE.Vector3(-size * 0.3, 0, val)
        const p2b = new THREE.Vector3(size, 0, val)
        return (
          <group key={`grid-${val}`}>
            <mesh><tubeGeometry args={[new THREE.LineCurve3(p1a, p1b), 1, 0.008, 4, false]} /><meshBasicMaterial color="#90CAF9" transparent opacity={0.4} /></mesh>
            <mesh><tubeGeometry args={[new THREE.LineCurve3(p2a, p2b), 1, 0.008, 4, false]} /><meshBasicMaterial color="#90CAF9" transparent opacity={0.4} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

// Auto-fit camera to geometry — frames the curve and revolved solid
function AutoFit({ bounds, fn }) {
  const { camera, controls } = useThree()
  const [a, b] = bounds

  useEffect(() => {
    let maxY = 0
    for (let i = 0; i <= 50; i++) {
      const x = a + (b - a) * (i / 50)
      const y = Math.abs(fn(x))
      if (y > maxY) maxY = y
    }
    const xRange = b - a
    const size = Math.max(xRange, maxY * 2)
    const dist = Math.max(size * 1.8, 4)
    const cx = (a + b) / 2
    const cy = maxY / 2
    camera.position.set(cx + dist * 0.7, cy + dist * 0.5, dist * 0.7)
    camera.lookAt(cx, cy, 0)
    camera.updateProjectionMatrix()
    if (controls && controls.target) {
      controls.target.set(cx, cy, 0)
      controls.update()
    }
  }, [bounds, fn, camera, controls, a, b])

  return null
}

function Scene({ preset, sweepAngle, wireframe }) {
  const showSolid = sweepAngle > 0.15
  const [a, b] = preset.bounds
  const cx = (a + b) / 2
  let maxY = 0
  for (let i = 0; i <= 20; i++) {
    const x = a + (b - a) * (i / 20)
    const y = Math.abs(preset.fn(x))
    if (y > maxY) maxY = y
  }
  const cy = maxY / 2

  return (
    <>
      <color attach="background" args={['#FFFFFF']} />
      <fog attach="fog" args={['#FFFFFF', 12, 30]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#ffffff" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#42A5F5" />
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#1565C0" />
      <spotLight position={[0, 8, 0]} intensity={0.6} angle={0.5} penumbra={0.5} color="#42A5F5" />

      <Axes3D size={Math.max(b, maxY, 3)} />

      {/* Always show the 2D curve as reference */}
      <CurvePreview fn={preset.fn} bounds={preset.bounds} />

      {/* Show solid when sweep starts */}
      {showSolid && <Solid fn={preset.fn} bounds={preset.bounds} sweepAngle={sweepAngle} color={preset.color} wireframe={wireframe} />}

      <AutoFit bounds={preset.bounds} fn={preset.fn} />

      <OrbitControls enablePan={false} minDistance={2} maxDistance={20} target={[cx, cy, 0]} />
    </>
  )
}

export default function SolidOfRevModule() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [sweepAngle, setSweepAngle] = useState(0.01)
  const [wireframe, setWireframe] = useState(true)
  const [animating, setAnimating] = useState(false)
  const [key, setKey] = useState(0)

  const preset = PRESETS[presetIdx]

  const handleAnimate = useCallback(() => {
    setSweepAngle(0.01)
    setAnimating(true)
    let start = null
    const duration = 4000
    const anim = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4) // ease out quart
      setSweepAngle(eased * Math.PI * 2)
      if (p < 1) requestAnimationFrame(anim)
      else { setSweepAngle(Math.PI * 2); setAnimating(false) }
    }
    requestAnimationFrame(anim)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* 3D Canvas — fills most of screen */}
      <div className="relative rounded-2xl overflow-hidden mb-4 border border-[#BBDEFB]"
        style={{ height: 'clamp(400px, 55vh, 650px)', background: '#FFFFFF', boxShadow: '0 2px 12px rgba(21,101,192,0.08)' }}>
        <Canvas key={key} camera={{ position: [5, 3, 5], fov: 40 }} dpr={[1, 2]} shadows>
          <Scene preset={preset} sweepAngle={sweepAngle} wireframe={wireframe} />
        </Canvas>

        {/* Top-left label */}
        <div className="absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-mono text-[#0D1B2A]"
          style={{ background: 'rgba(240,247,255,0.92)', backdropFilter: 'blur(8px)', border: '1px solid #BBDEFB' }}>
          {preset.label} · x-axis
        </div>

        {/* Top-right AR button */}
        <Link to="/ar" className="absolute top-4 right-4">
          <motion.button whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-heading font-semibold text-[#1565C0] rounded-xl border border-[#1565C0] hover:bg-[#E3F2FD] transition-colors"
            style={{ background: 'rgba(240,247,255,0.92)', backdropFilter: 'blur(8px)' }}>
            🔮 View in AR
          </motion.button>
        </Link>

        {/* Bottom sweep indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: '#E3F2FD' }}>
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${(sweepAngle / (Math.PI * 2)) * 100}%`, background: `linear-gradient(90deg, ${preset.color}, #42A5F5)` }} />
          </div>
        </div>
      </div>

      {/* Volume formula */}
      <div className="glass p-5 rounded-2xl mb-4" style={{ background: '#E3F2FD' }}>
        <p className="text-[#1565C0] text-sm font-mono mb-2">Volume (Disc Method)</p>
        <BlockMathDisplay math={`V = \\pi\\int_{${preset.bounds[0]}}^{${Number(preset.bounds[1]).toFixed(2)}} \\left(${preset.fnStr}\\right)^2 dx = ${preset.volume}`} />
      </div>

      {/* Sweep angle slider */}
      <div className="glass p-4 rounded-2xl mb-4">
        <div className="flex justify-between mb-2">
          <p className="text-[#64748B] text-sm font-heading">Rotation Angle</p>
          <p className="text-[#1565C0] text-sm font-mono font-bold">{((sweepAngle / (Math.PI * 2)) * 360).toFixed(0)}°</p>
        </div>
        <input type="range" min={0.01} max={Math.PI * 2} step={0.05} value={sweepAngle}
          onChange={(e) => setSweepAngle(Number(e.target.value))} className="w-full" style={{ accentColor: '#1565C0' }} />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button onClick={handleAnimate} disabled={animating}
          className="btn-primary py-4 text-base disabled:opacity-50">
          {animating ? '⟳ Rotating...' : '▶ Animate Rotation'}
        </button>
        <button onClick={() => setWireframe((w) => !w)} className="btn-secondary py-4 text-base">
          {wireframe ? '◻ Hide Wireframe' : '◻ Show Wireframe'}
        </button>
      </div>

      {/* Preset selector */}
      <div className="glass p-5 rounded-2xl">
        <p className="text-[#64748B] text-sm font-heading mb-3">Select Function</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <motion.button key={i} whileTap={{ scale: 0.95 }}
              onClick={() => { setPresetIdx(i); setKey((k) => k + 1); setSweepAngle(0.01) }}
              className={`px-4 py-3 rounded-xl text-sm font-mono font-semibold transition-all ${
                presetIdx === i ? 'border-2' : 'border'
              }`}
              style={presetIdx === i
                ? { background: `${p.color}25`, borderColor: p.color, color: p.color }
                : { background: '#F0F7FF', borderColor: '#BBDEFB', color: '#64748B' }}>
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
