/**
 * CalcuLens AR — GLB Model Generator
 * Run: node scripts/generate-models.js
 * Outputs: /public/models/*.glb
 */

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { createCanvas } from 'canvas'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Setup fake DOM for GLTFExporter
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.window = dom.window
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement
global.URL = dom.window.URL
global.FileReader = dom.window.FileReader
global.Blob = dom.window.Blob
global.self = dom.window

function exportGLB(scene, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter()
    exporter.parse(
      scene,
      (result) => {
        const buffer = Buffer.from(result)
        const filepath = path.join(OUTPUT_DIR, filename)
        fs.writeFileSync(filepath, buffer)
        console.log(`✅ Generated: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`)
        resolve()
      },
      (err) => reject(err),
      { binary: true }
    )
  })
}

function createScene() {
  const scene = new THREE.Scene()
  scene.add(new THREE.AmbientLight(0xffffff, 0.8))
  const light = new THREE.DirectionalLight(0x667eea, 1.2)
  light.position.set(5, 5, 5)
  scene.add(light)
  return scene
}

// ============================================================
// SOLID OF REVOLUTION MODELS
// ============================================================

async function genParaboloid() {
  const scene = createScene()
  const points = []
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 2
    const y = x * x
    points.push(new THREE.Vector2(y * 0.35, (x - 1) * 0.6))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0x667eea, transparent: true, opacity: 0.75, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-paraboloid.glb')
}

async function genCone() {
  const scene = createScene()
  const points = []
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * 3
    points.push(new THREE.Vector2(x * 0.3, (x - 1.5) * 0.5))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0x764ba2, transparent: true, opacity: 0.75, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-cone.glb')
}

async function genSphere() {
  const scene = createScene()
  const r = 1
  const points = []
  for (let i = 0; i <= 60; i++) {
    const x = -r + (i / 60) * 2 * r
    const y = Math.sqrt(Math.max(0, r * r - x * x))
    points.push(new THREE.Vector2(y * 0.6, x * 0.6))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0x4caf50, transparent: true, opacity: 0.65, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-sphere.glb')
}

async function genSqrtx() {
  const scene = createScene()
  const points = []
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 4
    const y = Math.sqrt(x)
    points.push(new THREE.Vector2(y * 0.35, (x - 2) * 0.4))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0x00bcd4, transparent: true, opacity: 0.75, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-sqrtx.glb')
}

async function genSinx() {
  const scene = createScene()
  const points = []
  for (let i = 0; i <= 80; i++) {
    const x = (i / 80) * Math.PI
    const y = Math.max(0, Math.sin(x))
    points.push(new THREE.Vector2(y * 0.6, (x - Math.PI / 2) * 0.6))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0xff9800, transparent: true, opacity: 0.75, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-sinx.glb')
}

async function genReciprocal() {
  const scene = createScene()
  const points = []
  for (let i = 0; i <= 60; i++) {
    const x = 1 + (i / 60) * 2
    const y = 1 / x
    points.push(new THREE.Vector2(y * 0.7, (x - 2) * 0.7))
  }
  const geo = new THREE.LatheGeometry(points, 64)
  const mat = new THREE.MeshStandardMaterial({ color: 0xf44336, transparent: true, opacity: 0.75, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'solid-of-revolution-reciprocal.glb')
}

// ============================================================
// AREA UNDER CURVE MODELS
// ============================================================

async function genAreaX2() {
  const scene = createScene()
  const n = 10
  const a = 0, b = 2
  for (let i = 0; i < n; i++) {
    const xMid = a + (i + 0.5) * (b - a) / n
    const h = xMid * xMid
    const dx = (b - a) / n
    const geo = new THREE.BoxGeometry(dx * 0.9, h * 0.5, 0.15)
    const t = i / n
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.66 - t * 0.2, 0.7, 0.5), metalness: 0.2, roughness: 0.5 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((a + (i + 0.5) * dx - 1) * 0.7, h * 0.25, 0)
    scene.add(mesh)
  }
  // Curve
  const curvePoints = []
  for (let i = 0; i <= 40; i++) {
    const x = a + (b - a) * (i / 40)
    curvePoints.push(new THREE.Vector3((x - 1) * 0.7, x * x * 0.5, 0))
  }
  const curvePath = new THREE.CatmullRomCurve3(curvePoints)
  const tubeGeo = new THREE.TubeGeometry(curvePath, 60, 0.03, 8, false)
  scene.add(new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3 })))
  await exportGLB(scene, 'area-under-curve-x2.glb')
}

async function genAreaSinx() {
  const scene = createScene()
  const n = 12
  const a = 0, b = Math.PI
  for (let i = 0; i < n; i++) {
    const xMid = a + (i + 0.5) * (b - a) / n
    const h = Math.max(0, Math.sin(xMid))
    const dx = (b - a) / n
    const geo = new THREE.BoxGeometry(dx * 0.85, h * 0.6, 0.15)
    const t = i / n
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(0.38 - t * 0.15, 0.7, 0.5), metalness: 0.2, roughness: 0.5 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((a + (i + 0.5) * dx - Math.PI / 2) * 0.5, h * 0.3, 0)
    scene.add(mesh)
  }
  await exportGLB(scene, 'area-under-curve-sinx.glb')
}

async function genAreaBetween() {
  const scene = createScene()
  // Region between y=x and y=x² from 0 to 1
  const shape = new THREE.Shape()
  const steps = 40
  shape.moveTo(0, 0)
  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    shape.lineTo(x * 1.4 - 0.7, x * 1.4 * 0.6)
  }
  for (let i = steps; i >= 0; i--) {
    const x = i / steps
    shape.lineTo(x * 1.4 - 0.7, (x * x) * 0.6 * 1.4)
  }
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false })
  const mat = new THREE.MeshStandardMaterial({ color: 0x9c27b0, transparent: true, opacity: 0.65, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })
  scene.add(new THREE.Mesh(geo, mat))
  await exportGLB(scene, 'area-between-curves.glb')
}

// ============================================================
// TANGENT & DERIVATIVE MODELS
// ============================================================

async function genTangentParabola() {
  const scene = createScene()
  // Parabola curve
  const pts = []
  for (let i = 0; i <= 60; i++) {
    const x = -2 + (i / 60) * 4
    pts.push(new THREE.Vector3(x * 0.6, x * x * 0.3, 0))
  }
  const path = new THREE.CatmullRomCurve3(pts)
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(path, 80, 0.04, 8, false), new THREE.MeshStandardMaterial({ color: 0x667eea, emissive: 0x667eea, emissiveIntensity: 0.2 })))
  // Tangent line at x=1 (slope=2)
  const tx1 = new THREE.Vector3(-0.8, -0.15, 0)
  const tx2 = new THREE.Vector3(1.2, 0.45, 0)
  const tPath = new THREE.LineCurve3(tx1, tx2)
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(tPath, 20, 0.04, 8, false), new THREE.MeshStandardMaterial({ color: 0xf44336, emissive: 0xf44336, emissiveIntensity: 0.3 })))
  // Point at (1,1)
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.5 }))
  sphere.position.set(0.6, 0.3, 0)
  scene.add(sphere)
  await exportGLB(scene, 'tangent-line-parabola.glb')
}

async function genTangentSaddle() {
  const scene = createScene()
  // Saddle surface z = x² - y²
  const res = 30
  const geo = new THREE.BufferGeometry()
  const positions = []
  const indices = []
  for (let i = 0; i <= res; i++) {
    for (let j = 0; j <= res; j++) {
      const x = -1.5 + (i / res) * 3
      const y = -1.5 + (j / res) * 3
      const z = (x * x - y * y) * 0.4
      positions.push(x * 0.6, z, y * 0.6)
    }
  }
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      const a = i * (res + 1) + j
      indices.push(a, a + 1, a + res + 1)
      indices.push(a + 1, a + res + 2, a + res + 1)
    }
  }
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x667eea, transparent: true, opacity: 0.65, side: THREE.DoubleSide })))
  // Tangent plane at origin
  const planeGeo = new THREE.PlaneGeometry(2.2, 2.2)
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xff9800, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
  scene.add(new THREE.Mesh(planeGeo, planeMat))
  await exportGLB(scene, 'tangent-plane-saddle.glb')
}

// ============================================================
// OPTIMIZATION MODEL
// ============================================================

async function genOptimizationBox() {
  const scene = createScene()
  // Open box: x=4, h=2 (scaled down)
  const s = 4 * 0.2, h = 2 * 0.2
  const mat = new THREE.MeshStandardMaterial({ color: 0x795548, metalness: 0.2, roughness: 0.7 })
  const t = 0.03
  // Bottom
  scene.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(s, t, s), mat), { position: new THREE.Vector3(0, 0, 0) }))
  // 4 sides
  const sides = [
    [s, h, t, 0, h / 2, s / 2],
    [s, h, t, 0, h / 2, -s / 2],
    [t, h, s, s / 2, h / 2, 0],
    [t, h, s, -s / 2, h / 2, 0],
  ]
  sides.forEach(([w, ht, d, px, py, pz]) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), mat)
    mesh.position.set(px, py, pz)
    scene.add(mesh)
  })
  await exportGLB(scene, 'optimization-box.glb')
}

// ============================================================
// RUN ALL
// ============================================================

async function main() {
  console.log('🔧 Generating CalcuLens AR GLB models...\n')

  try {
    await genParaboloid()
    await genCone()
    await genSphere()
    await genSqrtx()
    await genSinx()
    await genReciprocal()
    await genAreaX2()
    await genAreaSinx()
    await genAreaBetween()
    await genTangentParabola()
    await genTangentSaddle()
    await genOptimizationBox()

    console.log(`\n🎉 All 12 models generated in ${OUTPUT_DIR}`)
  } catch (err) {
    console.error('❌ Error generating models:', err.message)
    console.error('\nTip: If GLTFExporter fails in Node.js, try:')
    console.error('  npm install jsdom canvas')
    console.error('  Or use the browser-based export at /dev/export\n')
    process.exit(1)
  }
}

main()
