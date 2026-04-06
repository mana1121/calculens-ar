import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function ParametricTorus() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.2, 0.35, 128, 32]} />
      <meshStandardMaterial
        color="#667eea"
        wireframe={false}
        metalness={0.5}
        roughness={0.15}
        emissive="#764ba2"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const count = 60
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const pointsRef = useRef()
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial color="#a78bfa" size={0.05} transparent opacity={0.6} />
    </points>
  )
}

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d1a2e 100%)' }}
      />

      {/* 3D Canvas — visible on all devices */}
      <div className="absolute inset-0 opacity-90">
        <Canvas camera={{ position: [0, 0, 3.5], fov: 65 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#667eea" />
          <pointLight position={[-5, -5, -5]} intensity={0.8} color="#764ba2" />
          <pointLight position={[0, 3, 0]} intensity={0.5} color="#a78bfa" />
          <ParametricTorus />
          <FloatingParticles />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.8} />
        </Canvas>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 glass rounded-full text-base text-white font-heading mb-8">
            <span>🎓</span>
            <span>Interactive Calculus Learning Platform</span>
          </div>

          <h1 className="font-heading font-bold text-6xl md:text-8xl text-white mb-6 leading-tight drop-shadow-lg">
            Calcu<span style={{ background: 'linear-gradient(135deg, #667eea, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lens</span>{' '}
            <span className="text-white">AR</span>
          </h1>

          <p className="font-heading text-2xl md:text-3xl text-white mb-8 glow-text font-semibold">
            See the Math. Feel the Change.
          </p>

          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            3D Interactive Calculus Visualization with AI & Augmented Reality for students everywhere
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#features">
            <button className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
              🚀 Explore Features
            </button>
          </a>
          <a href="/ar">
            <button className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
              🔮 Try AR Now
            </button>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-sm flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>↓</span>
        <span className="text-xs">Scroll to explore</span>
      </motion.div>
    </div>
  )
}
