/**
 * CalcuLens AR — Enhanced GLB Model Generator
 * Run: node scripts/generate-models.js
 * Outputs 12 high-quality .glb models to /public/models/
 */

import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { JSDOM } from 'jsdom'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'models')

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
global.window = dom.window
global.document = dom.window.document
global.FileReader = dom.window.FileReader
global.Blob = dom.window.Blob
global.self = dom.window

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

/**
 * Normalize all visible meshes in a scene so the combined bounding box
 * is centered at origin and the largest dimension equals targetMaxDim (in metres).
 * Lights are not affected. This guarantees every exported GLB has a consistent
 * size for stable native AR (iOS Quick Look + Android Scene Viewer).
 */
function normalizeScene(scene, targetMaxDim = 1.0) {
  const box = new THREE.Box3()
  scene.traverse((obj) => {
    if (obj.isMesh && obj.geometry) {
      obj.geometry.computeBoundingBox()
      const meshBox = obj.geometry.boundingBox.clone()
      meshBox.applyMatrix4(obj.matrixWorld)
      box.union(meshBox)
    }
  })
  if (box.isEmpty()) return
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(center)
  const maxDim = Math.max(size.x, size.y, size.z)
  if (maxDim === 0) return
  const s = targetMaxDim / maxDim

  // Apply translation + scale to every mesh
  scene.traverse((obj) => {
    if (obj.isMesh && obj.geometry) {
      obj.geometry.translate(-center.x, -center.y, -center.z)
      obj.geometry.scale(s, s, s)
    }
  })
}

function exportGLB(scene, filename) {
  // Always normalize before exporting so every GLB has a 1m max dimension
  // centered at origin — this is critical for stable AR on iOS and Android.
  normalizeScene(scene, 1.0)

  return new Promise((resolve, reject) => {
    new GLTFExporter().parse(scene, (result) => {
      const buf = Buffer.from(result)
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), buf)
      console.log(`  ✅ ${filename} (${(buf.length / 1024).toFixed(1)} KB)`)
      resolve()
    }, (err) => reject(err), { binary: true })
  })
}

function createScene() {
  const scene = new THREE.Scene()
  // Only directional + point lights (no ambient — GLTFExporter warns)
  const d1 = new THREE.DirectionalLight(0xffffff, 1.5)
  d1.position.set(5, 8, 5)
  scene.add(d1)
  const d2 = new THREE.DirectionalLight(0x1565C0, 0.8)
  d2.position.set(-5, 3, -5)
  scene.add(d2)
  const p1 = new THREE.PointLight(0x42A5F5, 0.5)
  p1.position.set(0, -3, 0)
  scene.add(p1)
  return scene
}

function makeSolidMat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
    metalness: 0.2,
    roughness: 0.25,
  })
}

function makeWireMat(color) {
  return new THREE.MeshStandardMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
  })
}

function addAxisHelper(scene) {
  // X axis — red
  const xGeo = new THREE.CylinderGeometry(0.015, 0.015, 2, 8)
  const xMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.3 })
  const xMesh = new THREE.Mesh(xGeo, xMat)
  xMesh.rotation.z = Math.PI / 2
  xMesh.position.set(1, 0, 0)
  scene.add(xMesh)

  // Y axis — green
  const yMesh = new THREE.Mesh(xGeo.clone(), new THREE.MeshStandardMaterial({ color: 0x44ff44, emissive: 0x44ff44, emissiveIntensity: 0.3 }))
  yMesh.position.set(0, 1, 0)
  scene.add(yMesh)

  // Z axis — blue
  const zMesh = new THREE.Mesh(xGeo.clone(), new THREE.MeshStandardMaterial({ color: 0x4444ff, emissive: 0x4444ff, emissiveIntensity: 0.3 }))
  zMesh.rotation.x = Math.PI / 2
  zMesh.position.set(0, 0, 1)
  scene.add(zMesh)
}

function latheModel(fn, a, b, color, scale = 1) {
  const pts = []
  const N = 80
  for (let i = 0; i <= N; i++) {
    const x = a + (b - a) * (i / N)
    const y = Math.max(0.001, fn(x))
    pts.push(new THREE.Vector2(y * scale, (x - (a + b) / 2) * scale))
  }
  const geo = new THREE.LatheGeometry(pts, 80)
  return geo
}

// ===================== SOLIDS OF REVOLUTION =====================

async function genParaboloid() {
  const scene = createScene()
  const geo = latheModel(x => x * x, 0, 2, null, 0.45)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x1565C0)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0xBBDEFB)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-paraboloid.glb')
}

async function genCone() {
  const scene = createScene()
  const geo = latheModel(x => x, 0, 3, null, 0.35)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x42A5F5)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0x90CAF9)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-cone.glb')
}

async function genSphere() {
  const scene = createScene()
  const r = 1
  const geo = latheModel(x => Math.sqrt(Math.max(0, r * r - x * x)), -r, r, null, 0.7)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x4caf50)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0x88ff88)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-sphere.glb')
}

async function genSqrtx() {
  const scene = createScene()
  const geo = latheModel(x => Math.sqrt(Math.max(0, x)), 0, 4, null, 0.3)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x00bcd4)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0x88eeff)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-sqrtx.glb')
}

async function genSinx() {
  const scene = createScene()
  const geo = latheModel(x => Math.max(0, Math.sin(x)), 0, Math.PI, null, 0.45)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0xff9800)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0xffcc88)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-sinx.glb')
}

async function genReciprocal() {
  const scene = createScene()
  const geo = latheModel(x => 1 / x, 1, 3, null, 0.5)
  scene.add(new THREE.Mesh(geo, makeSolidMat(0xf44336)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0xff8888)))
  addAxisHelper(scene)
  await exportGLB(scene, 'solid-of-revolution-reciprocal.glb')
}

// ===================== AREA UNDER CURVE =====================

async function genAreaX2() {
  const scene = createScene()
  const n = 10, a = 0, b = 2
  const dx = (b - a) / n
  for (let i = 0; i < n; i++) {
    const xMid = a + (i + 0.5) * dx
    const h = xMid * xMid
    const geo = new THREE.BoxGeometry(dx * 0.85 * 0.5, h * 0.5 * 0.5, 0.25)
    const t = i / n
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.6 - t * 0.15, 0.8, 0.55),
      metalness: 0.1,
      roughness: 0.4,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((a + (i + 0.5) * dx - 1) * 0.5, h * 0.25 * 0.5, 0)
    scene.add(mesh)
  }
  // Curve tube
  const curvePoints = []
  for (let i = 0; i <= 50; i++) {
    const x = a + (b - a) * (i / 50)
    curvePoints.push(new THREE.Vector3((x - 1) * 0.5, x * x * 0.5 * 0.5, 0))
  }
  const curvePath = new THREE.CatmullRomCurve3(curvePoints)
  const tubeGeo = new THREE.TubeGeometry(curvePath, 60, 0.025, 8, false)
  scene.add(new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.4 })))
  addAxisHelper(scene)
  await exportGLB(scene, 'area-under-curve-x2.glb')
}

async function genAreaSinx() {
  const scene = createScene()
  const n = 12, a = 0, b = Math.PI
  const dx = (b - a) / n
  for (let i = 0; i < n; i++) {
    const xMid = a + (i + 0.5) * dx
    const h = Math.max(0, Math.sin(xMid))
    const geo = new THREE.BoxGeometry(dx * 0.8 * 0.4, h * 0.5, 0.2)
    const t = i / n
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.35 - t * 0.1, 0.75, 0.5),
      metalness: 0.1,
      roughness: 0.4,
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set((a + (i + 0.5) * dx - Math.PI / 2) * 0.35, h * 0.25, 0)
    scene.add(mesh)
  }
  addAxisHelper(scene)
  await exportGLB(scene, 'area-under-curve-sinx.glb')
}

async function genAreaBetween() {
  const scene = createScene()
  const shape = new THREE.Shape()
  const steps = 50
  shape.moveTo(-0.5, 0)
  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    shape.lineTo(x * 1.0 - 0.5, x * 0.6)
  }
  for (let i = steps; i >= 0; i--) {
    const x = i / steps
    shape.lineTo(x * 1.0 - 0.5, (x * x) * 0.6)
  }
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 })
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x9c27b0)))
  scene.add(new THREE.Mesh(geo.clone(), makeWireMat(0xcc88ff)))
  addAxisHelper(scene)
  await exportGLB(scene, 'area-between-curves.glb')
}

// ===================== TANGENT & DERIVATIVES =====================

async function genTangentParabola() {
  const scene = createScene()
  // Parabola curve — thick tube
  const pts = []
  for (let i = 0; i <= 80; i++) {
    const x = -2 + (i / 80) * 4
    pts.push(new THREE.Vector3(x * 0.4, x * x * 0.2, 0))
  }
  const path = new THREE.CatmullRomCurve3(pts)
  scene.add(new THREE.Mesh(
    new THREE.TubeGeometry(path, 80, 0.035, 12, false),
    new THREE.MeshStandardMaterial({ color: 0x1565C0, emissive: 0x1565C0, emissiveIntensity: 0.3 })
  ))
  // Tangent at (1,1)
  const tPath = new THREE.LineCurve3(new THREE.Vector3(-0.6, -0.1, 0), new THREE.Vector3(1.0, 0.5, 0))
  scene.add(new THREE.Mesh(
    new THREE.TubeGeometry(tPath, 20, 0.03, 8, false),
    new THREE.MeshStandardMaterial({ color: 0xf44336, emissive: 0xf44336, emissiveIntensity: 0.4 })
  ))
  // Point sphere
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 })
  )
  sphere.position.set(0.4, 0.2, 0)
  scene.add(sphere)
  addAxisHelper(scene)
  await exportGLB(scene, 'tangent-line-parabola.glb')
}

async function genTangentSaddle() {
  const scene = createScene()
  const res = 40
  const positions = [], indices = []
  for (let i = 0; i <= res; i++) {
    for (let j = 0; j <= res; j++) {
      const x = -1.2 + (i / res) * 2.4
      const y = -1.2 + (j / res) * 2.4
      const z = (x * x - y * y) * 0.3
      positions.push(x * 0.5, z, y * 0.5)
    }
  }
  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      const a = i * (res + 1) + j
      indices.push(a, a + 1, a + res + 1, a + 1, a + res + 2, a + res + 1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  scene.add(new THREE.Mesh(geo, makeSolidMat(0x1565C0)))
  // Tangent plane
  const planeGeo = new THREE.PlaneGeometry(1.5, 1.5)
  const planeMat = new THREE.MeshStandardMaterial({ color: 0xff9800, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
  scene.add(new THREE.Mesh(planeGeo, planeMat))
  // Origin point
  const sp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.6 }))
  scene.add(sp)
  addAxisHelper(scene)
  await exportGLB(scene, 'tangent-plane-saddle.glb')
}

// ===================== OPTIMIZATION =====================

async function genOptimizationBox() {
  const scene = createScene()
  const s = 0.6, h = 0.3
  const mat = new THREE.MeshStandardMaterial({ color: 0x795548, metalness: 0.15, roughness: 0.6 })
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.3 })

  // Bottom
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(s, 0.025, s), mat.clone())
  scene.add(bottom)

  // 4 sides
  const sides = [[s, h, 0.025, 0, h / 2, s / 2], [s, h, 0.025, 0, h / 2, -s / 2], [0.025, h, s, s / 2, h / 2, 0], [0.025, h, s, -s / 2, h / 2, 0]]
  sides.forEach(([w, ht, d, px, py, pz]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), mat.clone())
    m.position.set(px, py, pz)
    scene.add(m)
  })

  // Edge highlights
  const edges = [
    [s, 0.015, 0.015, 0, h, s / 2], [s, 0.015, 0.015, 0, h, -s / 2],
    [0.015, 0.015, s, s / 2, h, 0], [0.015, 0.015, s, -s / 2, h, 0],
  ]
  edges.forEach(([w, ht, d, px, py, pz]) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, ht, d), edgeMat.clone())
    m.position.set(px, py, pz)
    scene.add(m)
  })

  addAxisHelper(scene)
  await exportGLB(scene, 'optimization-box.glb')
}

// ===================== RUN ALL =====================

async function main() {
  console.log('\n🔧 Generating 12 enhanced CalcuLens AR models...\n')
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
  console.log(`\n🎉 All 12 models generated in ${OUTPUT_DIR}\n`)
}

main()
