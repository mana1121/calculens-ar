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
        color="#1565C0"
        wireframe={false}
        metalness={0.6}
        roughness={0.2}
        emissive="#42A5F5"
        emissiveIntensity={0.3}
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
      <pointsMaterial color="#BBDEFB" size={0.05} transparent opacity={0.4} />
    </points>
  )
}

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #FFFFFF 60%, #E3F2FD 100%)' }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[5, 5, 5]} intensity={1} color="#1565C0" />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#42A5F5" />
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
          <div className="inline-flex items-center gap-2 px-5 py-3 glass rounded-full text-base text-[#1565C0] font-heading mb-8">
            <span>🎓</span>
            <span>Interactive Calculus Learning Platform</span>
          </div>

          <h1 className="font-heading font-bold text-6xl md:text-8xl text-[#0D1B2A] mb-6 leading-tight drop-shadow-lg">
            Calcu<span style={{ color: '#42A5F5' }}>Lens</span>{' '}
            <span className="text-[#0D1B2A]">AR</span>
          </h1>

          <p className="font-heading text-2xl md:text-3xl text-[#1565C0] mb-8 glow-text font-semibold">
            See the Math. Feel the Change.
          </p>

          <p className="text-[#64748B] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#90CAF9] text-sm flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>↓</span>
        <span className="text-xs">Scroll to explore</span>
      </motion.div>
    </div>
  )
}
