import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'

const AR_MODELS = {
  solid_paraboloid: {
    src: '/models/solid-of-revolution-paraboloid.glb',
    title: 'Solid of Revolution: Paraboloid',
    description: 'y = x² rotated about the x-axis, bounds [0, 2]',
    formula: 'V = \\pi\\int_0^2 (x^2)^2\\,dx = \\frac{32\\pi}{5}',
    icon: '🔵',
    isRevolution: true,
    fn: (x) => x * x,
    bounds: [0, 2],
    color: '#667eea',
    realWorld: {
      problem: 'A satellite dish is shaped like a paraboloid formed by rotating y = x² about the x-axis from x = 0 to x = 2 meters. Calculate the volume of material needed to manufacture the dish.',
      context: '🛰️ Satellite Dish Manufacturing',
      solution: [
        { step: 'Set up the volume integral using the disc method', math: 'V = \\pi\\int_0^2 [f(x)]^2\\,dx = \\pi\\int_0^2 (x^2)^2\\,dx' },
        { step: 'Simplify the integrand', math: 'V = \\pi\\int_0^2 x^4\\,dx' },
        { step: 'Integrate using the power rule', math: 'V = \\pi\\left[\\frac{x^5}{5}\\right]_0^2 = \\pi\\cdot\\frac{32}{5}' },
        { step: 'Final answer', math: 'V = \\frac{32\\pi}{5} \\approx 20.11 \\text{ m}^3' },
      ],
    },
  },
  solid_cone: {
    src: '/models/solid-of-revolution-cone.glb',
    title: 'Solid of Revolution: Cone',
    description: 'y = x rotated about the x-axis, bounds [0, 3]',
    formula: 'V = \\pi\\int_0^3 x^2\\,dx = 9\\pi',
    icon: '🔺',
    isRevolution: true,
    fn: (x) => x,
    bounds: [0, 3],
    color: '#a78bfa',
    realWorld: {
      problem: 'A conical water tank has a height of 3 meters and a radius equal to its height. If the tank is completely full, what is the total volume of water it holds?',
      context: '🏗️ Water Tank Design',
      solution: [
        { step: 'The cone is formed by rotating y = x about x-axis from 0 to 3', math: 'V = \\pi\\int_0^3 x^2\\,dx' },
        { step: 'Integrate', math: 'V = \\pi\\left[\\frac{x^3}{3}\\right]_0^3 = \\pi\\cdot\\frac{27}{3}' },
        { step: 'Final answer', math: 'V = 9\\pi \\approx 28.27 \\text{ m}^3 \\approx 28{,}274 \\text{ liters}' },
      ],
    },
  },
  solid_sphere: {
    src: '/models/solid-of-revolution-sphere.glb',
    title: 'Solid of Revolution: Sphere',
    description: 'y = sqrt(r² - x²) rotated about the x-axis',
    formula: 'V = \\frac{4}{3}\\pi r^3',
    icon: '🌐',
    isRevolution: true,
    fn: (x) => Math.sqrt(Math.max(0, 4 - x * x)),
    bounds: [-2, 2],
    color: '#34d399',
    realWorld: {
      problem: 'A spherical water balloon has a radius of 2 cm. Water is leaking at a rate of 3 cm³/s. How fast is the radius decreasing when r = 2 cm?',
      context: '💧 Leaking Sphere — Related Rates',
      solution: [
        { step: 'Volume of sphere formula', math: 'V = \\frac{4}{3}\\pi r^3' },
        { step: 'Differentiate both sides with respect to time', math: '\\frac{dV}{dt} = 4\\pi r^2 \\cdot \\frac{dr}{dt}' },
        { step: 'Substitute dV/dt = -3, r = 2', math: '-3 = 4\\pi(2)^2 \\cdot \\frac{dr}{dt} = 16\\pi\\cdot\\frac{dr}{dt}' },
        { step: 'Solve for dr/dt', math: '\\frac{dr}{dt} = \\frac{-3}{16\\pi} \\approx -0.0597 \\text{ cm/s}' },
      ],
    },
  },
  solid_sqrtx: {
    src: '/models/solid-of-revolution-sqrtx.glb',
    title: 'Solid of Revolution: sqrt(x)',
    description: 'y = sqrt(x) rotated about the x-axis, bounds [0, 4]',
    formula: 'V = \\pi\\int_0^4 x\\,dx = 8\\pi',
    icon: '🥣',
    isRevolution: true,
    fn: (x) => Math.sqrt(Math.max(0, x)),
    bounds: [0, 4],
    color: '#34d399',
    realWorld: {
      problem: 'A bowl is designed by rotating the curve y = sqrt(x) about the x-axis from x = 0 to x = 4 inches. What volume of soup can this bowl hold?',
      context: '🍜 Bowl Design — Product Engineering',
      solution: [
        { step: 'Set up volume integral', math: 'V = \\pi\\int_0^4 (\\sqrt{x})^2\\,dx = \\pi\\int_0^4 x\\,dx' },
        { step: 'Integrate', math: 'V = \\pi\\left[\\frac{x^2}{2}\\right]_0^4 = \\pi\\cdot\\frac{16}{2}' },
        { step: 'Final answer', math: 'V = 8\\pi \\approx 25.13 \\text{ in}^3 \\approx 412 \\text{ mL}' },
      ],
    },
  },
  solid_sinx: {
    src: '/models/solid-of-revolution-sinx.glb',
    title: 'Solid of Revolution: sin(x)',
    description: 'y = sin(x) rotated about the x-axis, bounds [0, pi]',
    formula: 'V = \\pi\\int_0^{\\pi} \\sin^2(x)\\,dx = \\frac{\\pi^2}{2}',
    icon: '〰️',
    isRevolution: true,
    fn: (x) => Math.sin(x),
    bounds: [0, Math.PI],
    color: '#f59e0b',
    realWorld: {
      problem: 'A decorative vase is shaped by rotating y = sin(x) about the x-axis from x = 0 to x = pi. Find the volume of water the vase can hold.',
      context: '🏺 Vase Design — Architecture',
      solution: [
        { step: 'Set up the integral', math: 'V = \\pi\\int_0^{\\pi} \\sin^2(x)\\,dx' },
        { step: 'Use the identity sin²(x) = (1 - cos(2x))/2', math: 'V = \\pi\\int_0^{\\pi} \\frac{1-\\cos(2x)}{2}\\,dx' },
        { step: 'Integrate', math: 'V = \\frac{\\pi}{2}\\left[x - \\frac{\\sin(2x)}{2}\\right]_0^{\\pi} = \\frac{\\pi}{2}\\cdot\\pi' },
        { step: 'Final answer', math: 'V = \\frac{\\pi^2}{2} \\approx 4.93 \\text{ units}^3' },
      ],
    },
  },
  solid_reciprocal: {
    src: '/models/solid-of-revolution-reciprocal.glb',
    title: "Solid of Revolution: 1/x (Gabriel's Horn)",
    description: 'y = 1/x rotated about the x-axis, bounds [1, 3]',
    formula: 'V = \\pi\\int_1^3 \\frac{1}{x^2}\\,dx = \\frac{2\\pi}{3}',
    icon: '📯',
    isRevolution: true,
    fn: (x) => 1 / x,
    bounds: [1, 3],
    color: '#f87171',
    realWorld: {
      problem: "Gabriel's Horn paradox: The trumpet shape formed by rotating y = 1/x has FINITE volume but INFINITE surface area. Calculate the volume from x = 1 to x = 3.",
      context: "🎺 Gabriel's Horn — Mathematical Paradox",
      solution: [
        { step: 'Set up volume integral', math: 'V = \\pi\\int_1^3 \\left(\\frac{1}{x}\\right)^2 dx = \\pi\\int_1^3 \\frac{1}{x^2}\\,dx' },
        { step: 'Integrate', math: 'V = \\pi\\left[-\\frac{1}{x}\\right]_1^3 = \\pi\\left(-\\frac{1}{3}+1\\right)' },
        { step: 'Final answer', math: 'V = \\frac{2\\pi}{3} \\approx 2.09 \\text{ units}^3' },
      ],
    },
  },
  area_x2: {
    src: '/models/area-under-curve-x2.glb',
    title: 'Area Under Curve: x²',
    description: 'Riemann sum for y = x², bounds [0, 2], n = 10',
    formula: '\\int_0^2 x^2\\,dx = \\frac{8}{3}',
    icon: '📊',
    realWorld: {
      problem: 'A car accelerates from rest. Its velocity is v(t) = t² m/s. How far does it travel in the first 2 seconds?',
      context: '🚗 Distance from Velocity — Physics',
      solution: [
        { step: 'Distance = integral of velocity', math: 'd = \\int_0^2 t^2\\,dt' },
        { step: 'Integrate', math: 'd = \\left[\\frac{t^3}{3}\\right]_0^2 = \\frac{8}{3}' },
        { step: 'Final answer', math: 'd = \\frac{8}{3} \\approx 2.67 \\text{ meters}' },
      ],
    },
  },
  area_sinx: {
    src: '/models/area-under-curve-sinx.glb',
    title: 'Area Under Curve: sin(x)',
    description: 'Riemann sum for y = sin(x), bounds [0, pi], n = 12',
    formula: '\\int_0^{\\pi} \\sin(x)\\,dx = 2',
    icon: '📈',
    realWorld: {
      problem: 'The power output of a solar panel over half a day follows P(t) = sin(t) kW, from t = 0 to t = pi hours. Find the total energy generated.',
      context: '☀️ Solar Energy — Renewable Power',
      solution: [
        { step: 'Energy = integral of power over time', math: 'E = \\int_0^{\\pi} \\sin(t)\\,dt' },
        { step: 'Integrate', math: 'E = [-\\cos(t)]_0^{\\pi} = -\\cos(\\pi)+\\cos(0) = 1+1' },
        { step: 'Final answer', math: 'E = 2 \\text{ kWh}' },
      ],
    },
  },
  area_between: {
    src: '/models/area-between-curves.glb',
    title: 'Area Between Two Curves',
    description: 'Region between y = x and y = x², bounds [0, 1]',
    formula: '\\int_0^1 (x - x^2)\\,dx = \\frac{1}{6}',
    icon: '🟣',
    realWorld: {
      problem: 'Two companies have revenue models: Company A earns R_A(x) = x million/year and Company B earns R_B(x) = x² million/year. Find the total revenue difference over the first year (x = 0 to 1).',
      context: '📊 Business Revenue Comparison',
      solution: [
        { step: 'Revenue difference = area between curves', math: '\\Delta R = \\int_0^1 (x - x^2)\\,dx' },
        { step: 'Integrate', math: '\\Delta R = \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2}-\\frac{1}{3}' },
        { step: 'Final answer', math: '\\Delta R = \\frac{1}{6} \\approx \\$166{,}667' },
      ],
    },
  },
  tangent_parabola: {
    src: '/models/tangent-line-parabola.glb',
    title: 'Tangent Line on Parabola',
    description: 'Tangent line to y = x² at point (1, 1)',
    formula: 'y - 1 = 2(x - 1)',
    icon: '📐',
    realWorld: {
      problem: 'A ball is thrown upward with height h(t) = -t² + 4t meters. Find the velocity (instantaneous rate of change) at t = 1 second.',
      context: '⚽ Projectile Motion — Physics',
      solution: [
        { step: 'Velocity = derivative of position', math: "v(t) = h'(t) = -2t + 4" },
        { step: 'Evaluate at t = 1', math: 'v(1) = -2(1) + 4 = 2' },
        { step: 'The tangent line represents velocity at that instant', math: 'v(1) = 2 \\text{ m/s (upward)}' },
      ],
    },
  },
  tangent_saddle: {
    src: '/models/tangent-plane-saddle.glb',
    title: 'Tangent Plane on Surface',
    description: 'Tangent plane to z = x² - y² at the origin',
    formula: 'z = 0 \\text{ (tangent plane at origin)}',
    icon: '🏔️',
    realWorld: {
      problem: 'A mountain pass has elevation z = x² - y² (saddle shape). Find the tangent plane at the summit (origin) to determine which directions are uphill vs downhill.',
      context: '🏔️ Terrain Analysis — Geography',
      solution: [
        { step: 'Compute partial derivatives', math: '\\frac{\\partial z}{\\partial x} = 2x, \\quad \\frac{\\partial z}{\\partial y} = -2y' },
        { step: 'Evaluate at origin (0,0)', math: 'z_x(0,0) = 0, \\quad z_y(0,0) = 0' },
        { step: 'Tangent plane equation', math: 'z = 0 \\text{ (flat at the saddle point)}' },
      ],
    },
  },
  optimization_box: {
    src: '/models/optimization-box.glb',
    title: 'Optimization: Open Box',
    description: 'Open box with V = 32 cm³, minimum surface area',
    formula: 'S(x) = x^2 + \\frac{128}{x},\\quad x = 4,\\; h = 2',
    icon: '📦',
    realWorld: {
      problem: 'A company needs to manufacture open-top boxes with volume 32 cm³. Find the dimensions that minimize the amount of cardboard used (surface area).',
      context: '📦 Packaging Optimization — Manufacturing',
      solution: [
        { step: 'Let base be x × x and height h. Volume constraint:', math: 'x^2 h = 32 \\Rightarrow h = \\frac{32}{x^2}' },
        { step: 'Surface area = base + 4 sides', math: 'S = x^2 + 4xh = x^2 + 4x\\cdot\\frac{32}{x^2} = x^2 + \\frac{128}{x}' },
        { step: "Set S'(x) = 0", math: "S'(x) = 2x - \\frac{128}{x^2} = 0 \\Rightarrow x^3 = 64 \\Rightarrow x = 4" },
        { step: 'Optimal dimensions', math: 'x = 4\\text{ cm}, \\; h = \\frac{32}{16} = 2\\text{ cm}, \\; S_{min} = 48\\text{ cm}^2' },
      ],
    },
  },
}

// ─── 3D Components for Revolution Animation ───

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

// 3D solid of revolution
function RevolutionSolid({ fn, bounds, sweepAngle, color }) {
  const groupRef = useRef()
  const [a, b] = bounds

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.15
  })

  // Build geometry with axis of revolution along X
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
    g.computeBoundingBox()
    const c = new THREE.Vector3()
    g.boundingBox.getCenter(c)
    g.translate(-c.x, -c.y, -c.z)
    g.rotateZ(Math.PI / 2)
    return g
  }, [fn, a, b, sweepAngle])

  return (
    <group ref={groupRef}>
      <mesh geometry={geo}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          metalness={0.15}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
      <mesh geometry={geo}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  )
}

function Axes3D({ size = 3 }) {
  const axisData = [
    { dir: [1, 0, 0], label: 'X' },
    { dir: [0, 1, 0], label: 'Y' },
    { dir: [0, 0, 1], label: 'Z' },
  ]
  return (
    <group>
      {axisData.map(({ dir, label }) => {
        const end = dir.map((d) => d * size)
        const negEnd = dir.map((d) => d * -size * 0.3)
        const path = new THREE.LineCurve3(new THREE.Vector3(...negEnd), new THREE.Vector3(...end))
        return (
          <group key={label}>
            <mesh>
              <tubeGeometry args={[path, 1, 0.025, 8, false]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} transparent opacity={0.9} />
            </mesh>
            <mesh position={end} rotation={dir[0] === 1 ? [0, 0, -Math.PI / 2] : dir[2] === 1 ? [Math.PI / 2, 0, 0] : [0, 0, 0]}>
              <coneGeometry args={[0.06, 0.2, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </mesh>
            <Text position={end.map((e) => e * 1.12)} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle" font={undefined} fontWeight="bold">
              {label}
            </Text>
          </group>
        )
      })}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
    </group>
  )
}

function AutoFitAR({ bounds, fn }) {
  const { camera } = useThree()
  const [a, b] = bounds
  const fitted = useRef(false)

  if (!fitted.current) {
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
    fitted.current = true
  }

  return null
}

function RevolutionScene({ model, sweepAngle }) {
  const showSolid = sweepAngle > 0.15

  return (
    <>
      <color attach="background" args={['#080812']} />
      <fog attach="fog" args={['#080812', 8, 25]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#667eea" />
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#764ba2" />

      <Axes3D size={3} />

      {/* Before animation: show 2D curve in standard math orientation */}
      {!showSolid && <CurvePreview fn={model.fn} bounds={model.bounds} />}

      {/* During/after animation: show the 3D solid */}
      {showSolid && <RevolutionSolid fn={model.fn} bounds={model.bounds} sweepAngle={sweepAngle} color={model.color} />}

      <AutoFitAR bounds={model.bounds} fn={model.fn} />

      <OrbitControls enablePan={false} minDistance={2} maxDistance={15} target={[0, 0, 0]} />
    </>
  )
}

// ─── Main ARViewer Component ───

export default function ARViewer({ selectedTopic }) {
  const model = AR_MODELS[selectedTopic]
  const [scale, setScale] = useState(0.15)
  const [showProblem, setShowProblem] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [sweepAngle, setSweepAngle] = useState(0.01)
  const [animating, setAnimating] = useState(false)
  const [canvasKey, setCanvasKey] = useState(0)

  const handleAnimate = useCallback(() => {
    setSweepAngle(0.01)
    setAnimating(true)
    let start = null
    const duration = 4000
    const anim = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setSweepAngle(eased * Math.PI * 2)
      if (p < 1) requestAnimationFrame(anim)
      else { setSweepAngle(Math.PI * 2); setAnimating(false) }
    }
    requestAnimationFrame(anim)
  }, [])

  const handleReset = useCallback(() => {
    setSweepAngle(0.01)
    setAnimating(false)
    setCanvasKey((k) => k + 1)
  }, [])

  if (!model) return null

  const isRevolution = model.isRevolution

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Preview */}
      <div className="glass rounded-2xl overflow-hidden" style={{ minHeight: 400 }}>
        {isRevolution ? (
          <div style={{ width: '100%', height: 400, background: '#080812' }}>
            <Canvas key={canvasKey} camera={{ position: [5, 3, 5], fov: 40 }} dpr={[1, 2]}>
              <RevolutionScene model={model} sweepAngle={sweepAngle} />
            </Canvas>
          </div>
        ) : (
          <model-viewer
            id="ar-model-viewer"
            src={model.src}
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="12deg"
            shadow-intensity="1"
            ar-placement="floor"
            style={{ width: '100%', height: '400px', background: 'transparent' }}
            ar-scale="fixed"
            camera-orbit={`45deg 55deg ${(8 - scale * 6).toFixed(2)}m`}
            min-camera-orbit="auto auto 0.5m"
            max-camera-orbit="auto auto 12m"
            environment-image="neutral"
            exposure="0.8"
          />
        )}
      </div>

      {/* Hidden model-viewer for AR launch (revolution models only) */}
      {isRevolution && (
        <model-viewer
          id="ar-model-viewer"
          src={model.src}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          ar-scale="fixed"
          style={{ display: 'none' }}
        />
      )}

      {/* Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => {
            const mv = document.getElementById('ar-model-viewer')
            if (mv && mv.canActivateAR) {
              mv.activateAR()
            } else {
              alert('AR is available on mobile devices only. Open this page on your phone to use AR.')
            }
          }}
          className="py-4 rounded-2xl text-base font-heading font-bold text-white flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 0 24px rgba(102,126,234,0.4)' }}
        >
          🔮 View in AR
        </button>

        {isRevolution ? (
          <button
            onClick={handleAnimate}
            disabled={animating}
            className="py-4 rounded-2xl text-base font-heading font-bold text-white flex items-center justify-center gap-2 btn-secondary disabled:opacity-50"
          >
            {animating ? '⟳ Revolving...' : '▶ Animate'}
          </button>
        ) : (
          <button
            onClick={() => {
              const mv = document.getElementById('ar-model-viewer')
              if (mv) {
                const isRotating = mv.getAttribute('auto-rotate') !== null
                if (isRotating) {
                  mv.removeAttribute('auto-rotate')
                } else {
                  mv.setAttribute('auto-rotate', '')
                  mv.setAttribute('auto-rotate-delay', '0')
                  mv.setAttribute('rotation-per-second', '15deg')
                }
              }
            }}
            className="py-4 rounded-2xl text-base font-heading font-bold text-white flex items-center justify-center gap-2 btn-secondary"
          >
            ▶ Play / Pause
          </button>
        )}

        <button
          onClick={isRevolution ? handleReset : () => {
            const mv = document.getElementById('ar-model-viewer')
            if (mv) {
              mv.setAttribute('camera-orbit', '45deg 55deg 7.1m')
              mv.setAttribute('auto-rotate', '')
              setScale(0.15)
            }
          }}
          className="py-4 rounded-2xl text-base font-heading font-bold text-white flex items-center justify-center gap-2 btn-secondary"
        >
          ↩ Reset
        </button>
      </div>

      {/* Sweep progress bar (revolution models) */}
      {isRevolution && (
        <div className="glass p-4 rounded-2xl">
          <div className="flex justify-between mb-2">
            <p className="text-white/50 text-sm font-heading">Rotation Angle</p>
            <p className="text-purple-300 text-sm font-mono font-bold">{((sweepAngle / (Math.PI * 2)) * 360).toFixed(0)}°</p>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-100"
              style={{ width: `${(sweepAngle / (Math.PI * 2)) * 100}%`, background: `linear-gradient(90deg, ${model.color}, #a78bfa)` }} />
          </div>
        </div>
      )}

      {/* Zoom slider (non-revolution only) */}
      {!isRevolution && (
        <div className="glass p-4 rounded-2xl">
          <div className="flex justify-between mb-2">
            <p className="text-white/50 text-sm font-heading">Zoom</p>
            <p className="text-purple-300 text-sm font-mono font-bold">{(scale * 100).toFixed(0)}%</p>
          </div>
          <input type="range" min={0.05} max={1} step={0.02} value={scale}
            onChange={(e) => setScale(Number(e.target.value))} className="w-full accent-purple-500" />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Zoom Out</span>
            <span>Zoom In</span>
          </div>
        </div>
      )}

      {/* Formula */}
      <div className="glass p-4 rounded-2xl">
        <h3 className="font-heading font-bold text-white text-lg mb-1">{model.title}</h3>
        <p className="text-white/50 text-sm mb-3">{model.description}</p>
        <BlockMathDisplay math={model.formula} />
      </div>

      {/* Real-World Problem */}
      {model.realWorld && (
        <>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowProblem((s) => !s)}
            className="w-full py-4 rounded-2xl text-base font-heading font-semibold border flex items-center justify-center gap-2 transition-all"
            style={showProblem
              ? { background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.5)', color: '#fff' }
              : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }
            }
          >
            <span className="text-xl">🌍</span>
            {showProblem ? 'Hide Real-World Problem' : 'Real-World Problem'}
          </motion.button>

          <AnimatePresence>
            {showProblem && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden space-y-3"
              >
                <div className="glass p-4 rounded-2xl border border-amber-500/20" style={{ background: 'rgba(245,158,11,0.06)' }}>
                  <p className="text-amber-400 text-xs font-heading font-bold uppercase tracking-wider mb-2">
                    {model.realWorld.context}
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    {model.realWorld.problem}
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSolution((s) => !s)}
                  className="w-full py-3 rounded-xl text-sm font-heading font-semibold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  {showSolution ? '▲ Hide Solution' : '▼ Show Step-by-Step Solution'}
                </motion.button>

                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden space-y-3"
                    >
                      {model.realWorld.solution.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className="glass p-4 rounded-2xl"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold font-heading"
                              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-white/70 text-sm mb-2">{step.step}</p>
                              <BlockMathDisplay math={step.math} />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* AR Instructions */}
      <div className="glass-dark p-4 rounded-2xl border border-purple-500/20">
        <p className="text-purple-300 text-xs font-heading font-semibold mb-2">📱 How to use AR:</p>
        <ul className="text-white/50 text-xs space-y-1">
          <li>• Android: Tap "View in AR" → Google Scene Viewer</li>
          <li>• iOS: Tap "View in AR" → AR Quick Look</li>
          <li>• Desktop: Rotate and zoom the model above</li>
        </ul>
      </div>
    </div>
  )
}

export { AR_MODELS }
