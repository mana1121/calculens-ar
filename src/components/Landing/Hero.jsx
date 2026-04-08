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
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <meshStandardMaterial
        color="#8B5CF6"
        wireframe={false}
        metalness={0.7}
        roughness={0.15}
        emissive="#6B3FA0"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function FloatingParticles() {
  const count = 80
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
      <pointsMaterial color="#A78BFA" size={0.06} transparent opacity={0.7} />
    </points>
  )
}

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Deep purple gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, #1A0B2E 0%, #0A0118 70%)' }}
      />

      {/* Noise texture overlay */}
      <div className="noise-texture" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      {/* 3D Canvas */}
      <div className="absolute inset-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[5, 5, 5]} intensity={1.2} color="#8B5CF6" />
          <pointLight position={[-5, -5, -5]} intensity={0.6} color="#14B8A6" />
          <ParametricTorus />
          <FloatingParticles />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-3 glass rounded-full text-base text-[#C4B5FD] font-heading mb-8">
            <span>🎓</span>
            <span>Interactive Calculus Learning Platform</span>
          </div>

          <h1 className="font-heading font-bold text-6xl md:text-8xl text-white mb-6 leading-tight drop-shadow-lg">
            Calcu<span style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lens</span>{' '}
            <span className="text-white">AR</span>
          </h1>

          <p className="font-heading text-2xl md:text-3xl text-[#14B8A6] mb-8 glow-text font-semibold">
            See the Math. Feel the Change.
          </p>

          <p className="text-[#9CA3AF] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#A78BFA] text-sm flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>↓</span>
        <span className="text-xs">Scroll to explore</span>
      </motion.div>
    </div>
  )
}
