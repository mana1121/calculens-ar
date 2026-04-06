import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'
import { Link } from 'react-router-dom'

const PRESETS = [
  { label: 'y = x²', fn: (x) => x * x, fnStr: 'x^2', bounds: [0, 2], volume: '\\frac{32\\pi}{5} \\approx 20.11', color: '#667eea' },
  { label: 'y = x', fn: (x) => x, fnStr: 'x', bounds: [0, 3], volume: '9\\pi \\approx 28.27', color: '#a78bfa' },
  { label: 'y = √x', fn: (x) => Math.sqrt(Math.max(0, x)), fnStr: '\\sqrt{x}', bounds: [0, 4], volume: '8\\pi \\approx 25.13', color: '#34d399' },
  { label: 'y = sin(x)', fn: (x) => Math.sin(x), fnStr: '\\sin(x)', bounds: [0, Math.PI], volume: '\\frac{\\pi^2}{2} \\approx 4.93', color: '#f59e0b' },
  { label: 'y = 1/x', fn: (x) => 1 / x, fnStr: '\\frac{1}{x}', bounds: [1, 3], volume: '\\frac{2\\pi}{3} \\approx 2.09', color: '#f87171' },
]

function Solid({ fn, bounds, sweepAngle, color, wireframe }) {
  const groupRef = useRef()
  const [a, b] = bounds

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.x += dt * 0.05
  })

  const geo = useMemo(() => {
    const pts = []
    const N = 150
    for (let i = 0; i <= N; i++) {
      const t = i / N
      const x = a + (b - a) * t
      const y = Math.max(0.0001, fn(x))
      pts.push(new THREE.Vector2(y, x))
    }
    const g = new THREE.LatheGeometry(pts, 96, 0, sweepAngle)
    // Center it
    g.computeBoundingBox()
    const c = new THREE.Vector3()
    g.boundingBox.getCenter(c)
    g.translate(-c.x, -c.y, -c.z)
    // Rotate so axis of revolution is horizontal
    g.rotateZ(Math.PI / 2)
    return g
  }, [fn, a, b, sweepAngle])

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Main solid */}
      <mesh geometry={geo} scale={1}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={0.8}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Wireframe overlay */}
      {wireframe && (
        <mesh geometry={geo} scale={1}>
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
        </mesh>
      )}
      {/* Inner glow mesh */}
      <mesh geometry={geo} scale={0.995}>
        <meshBasicMaterial color={color} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

function CurveOutline({ fn, bounds, color }) {
  const [a, b] = bounds
  const pts = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 80; i++) {
      const x = a + (b - a) * (i / 80)
      const y = fn(x)
      arr.push(new THREE.Vector3(x - (a + b) / 2, y, 0))
    }
    return arr
  }, [fn, a, b])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    return g
  }, [pts])

  return (
    <line geometry={geo}>
      <lineBasicMaterial color="#f59e0b" transparent opacity={0.6} />
    </line>
  )
}

// 3D Axes — thick, fluorescent white, bold
function Axes3D({ size = 4 }) {
  const axisData = [
    { dir: [1, 0, 0], label: 'X' },
    { dir: [0, 1, 0], label: 'Y' },
    { dir: [0, 0, 1], label: 'Z' },
  ]

  const axisColor = '#ffffff'

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
              <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.8} transparent opacity={0.9} />
            </mesh>
            {/* Arrow cone at end */}
            <mesh position={end}
              rotation={dir[0] === 1 ? [0, 0, -Math.PI / 2] : dir[2] === 1 ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
              <coneGeometry args={[0.08, 0.25, 8]} />
              <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.8} />
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
                    <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={0.5} transparent opacity={0.6} />
                  </mesh>
                  <Text
                    position={[pos[0] + (dir[0] === 1 ? 0 : -0.2), pos[1] + (dir[1] === 1 ? 0 : -0.2), pos[2] + (dir[2] === 1 ? 0.2 : 0)]}
                    fontSize={0.2}
                    color="rgba(255,255,255,0.6)"
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
        <meshStandardMaterial color={axisColor} emissive={axisColor} emissiveIntensity={1} />
      </mesh>
      <Text position={[-0.2, -0.25, 0]} fontSize={0.22} color="rgba(255,255,255,0.7)" font={undefined}>
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
            <mesh><tubeGeometry args={[new THREE.LineCurve3(p1a, p1b), 1, 0.008, 4, false]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.06} /></mesh>
            <mesh><tubeGeometry args={[new THREE.LineCurve3(p2a, p2b), 1, 0.008, 4, false]} /><meshBasicMaterial color="#ffffff" transparent opacity={0.06} /></mesh>
          </group>
        )
      })}
    </group>
  )
}

// Auto-fit camera to geometry
function AutoFit({ bounds, fn }) {
  const { camera } = useThree()
  const [a, b] = bounds

  useEffect(() => {
    // Calculate bounding sphere radius
    let maxR = 0
    for (let i = 0; i <= 50; i++) {
      const x = a + (b - a) * (i / 50)
      const y = fn(x)
      const r = Math.sqrt(x * x + y * y)
      if (r > maxR) maxR = r
    }
    const dist = Math.max(maxR * 2.2, 3)
    camera.position.set(dist * 0.8, dist * 0.5, dist * 0.8)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [bounds, fn, camera, a, b])

  return null
}

function Scene({ preset, sweepAngle, wireframe }) {
  return (
    <>
      <color attach="background" args={['#080812']} />
      <fog attach="fog" args={['#080812', 8, 25]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#667eea" />
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#764ba2" />
      <spotLight position={[0, 8, 0]} intensity={0.8} angle={0.5} penumbra={0.5} color="#a78bfa" />

      <Axes3D size={3} />
      <CurveOutline fn={preset.fn} bounds={preset.bounds} color={preset.color} />
      <Solid fn={preset.fn} bounds={preset.bounds} sweepAngle={sweepAngle} color={preset.color} wireframe={wireframe} />
      <AutoFit bounds={preset.bounds} fn={preset.fn} />

      {/* Ground reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.8} roughness={0.3} transparent opacity={0.5} />
      </mesh>

      <OrbitControls enablePan={false} minDistance={2} maxDistance={15} target={[0, 0, 0]} />
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
      <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/5"
        style={{ height: 'clamp(400px, 55vh, 650px)', background: '#080812' }}>
        <Canvas key={key} camera={{ position: [5, 3, 5], fov: 40 }} dpr={[1, 2]} shadows>
          <Scene preset={preset} sweepAngle={sweepAngle} wireframe={wireframe} />
        </Canvas>

        {/* Top-left label */}
        <div className="absolute top-4 left-4 px-4 py-2 rounded-xl text-sm font-mono text-white/90"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          {preset.label} · x-axis
        </div>

        {/* Top-right AR button */}
        <Link to="/ar" className="absolute top-4 right-4">
          <motion.button whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm font-heading font-semibold text-purple-300 rounded-xl border border-purple-500/40 hover:bg-purple-500/10 transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
            🔮 View in AR
          </motion.button>
        </Link>

        {/* Bottom sweep indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${(sweepAngle / (Math.PI * 2)) * 100}%`, background: `linear-gradient(90deg, ${preset.color}, #a78bfa)` }} />
          </div>
        </div>
      </div>

      {/* Volume formula */}
      <div className="glass p-5 rounded-2xl mb-4" style={{ background: 'rgba(102,126,234,0.06)' }}>
        <p className="text-white/40 text-sm font-mono mb-2">Volume (Disc Method)</p>
        <BlockMathDisplay math={`V = \\pi\\int_{${preset.bounds[0]}}^{${Number(preset.bounds[1]).toFixed(2)}} \\left(${preset.fnStr}\\right)^2 dx = ${preset.volume}`} />
      </div>

      {/* Sweep angle slider */}
      <div className="glass p-4 rounded-2xl mb-4">
        <div className="flex justify-between mb-2">
          <p className="text-white/50 text-sm font-heading">Rotation Angle</p>
          <p className="text-purple-300 text-sm font-mono font-bold">{((sweepAngle / (Math.PI * 2)) * 360).toFixed(0)}°</p>
        </div>
        <input type="range" min={0.01} max={Math.PI * 2} step={0.05} value={sweepAngle}
          onChange={(e) => setSweepAngle(Number(e.target.value))} className="w-full accent-purple-500" />
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
        <p className="text-white/50 text-sm font-heading mb-3">Select Function</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <motion.button key={i} whileTap={{ scale: 0.95 }}
              onClick={() => { setPresetIdx(i); setKey((k) => k + 1); setSweepAngle(0.01) }}
              className={`px-4 py-3 rounded-xl text-sm font-mono font-semibold transition-all ${
                presetIdx === i ? 'text-white border-2' : 'text-white/50 border border-white/10 hover:border-white/30'
              }`}
              style={presetIdx === i ? { background: `${p.color}25`, borderColor: `${p.color}80` } : {}}>
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
