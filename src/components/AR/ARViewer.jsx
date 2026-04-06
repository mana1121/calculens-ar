import { BlockMathDisplay } from '../Shared/MathDisplay.jsx'

const AR_MODELS = {
  solid_paraboloid: {
    src: '/models/solid-of-revolution-paraboloid.glb',
    title: 'Solid of Revolution: Paraboloid',
    description: 'y = x² rotated about the x-axis, bounds [0, 2]',
    formula: 'V = \\pi\\int_0^2 (x^2)^2\\,dx = \\frac{32\\pi}{5}',
    icon: '🔵',
  },
  solid_cone: {
    src: '/models/solid-of-revolution-cone.glb',
    title: 'Solid of Revolution: Cone',
    description: 'y = x rotated about the x-axis, bounds [0, 3]',
    formula: 'V = \\pi\\int_0^3 x^2\\,dx = 9\\pi',
    icon: '🔺',
  },
  solid_sphere: {
    src: '/models/solid-of-revolution-sphere.glb',
    title: 'Solid of Revolution: Sphere',
    description: 'y = √(r² - x²) rotated about the x-axis',
    formula: 'V = \\frac{4}{3}\\pi r^3',
    icon: '🌐',
  },
  solid_sqrtx: {
    src: '/models/solid-of-revolution-sqrtx.glb',
    title: 'Solid of Revolution: √x',
    description: 'y = √x rotated about the x-axis, bounds [0, 4]',
    formula: 'V = \\pi\\int_0^4 x\\,dx = 8\\pi',
    icon: '🥣',
  },
  solid_sinx: {
    src: '/models/solid-of-revolution-sinx.glb',
    title: 'Solid of Revolution: sin(x)',
    description: 'y = sin(x) rotated about the x-axis, bounds [0, π]',
    formula: 'V = \\pi\\int_0^{\\pi} \\sin^2(x)\\,dx = \\frac{\\pi^2}{2}',
    icon: '〰️',
  },
  solid_reciprocal: {
    src: '/models/solid-of-revolution-reciprocal.glb',
    title: "Solid of Revolution: 1/x (Gabriel's Horn)",
    description: 'y = 1/x rotated about the x-axis, bounds [1, 3]',
    formula: 'V = \\pi\\int_1^3 \\frac{1}{x^2}\\,dx = \\frac{2\\pi}{3}',
    icon: '📯',
  },
  area_x2: {
    src: '/models/area-under-curve-x2.glb',
    title: 'Area Under Curve: x²',
    description: 'Riemann sum for y = x², bounds [0, 2], n = 10',
    formula: '\\int_0^2 x^2\\,dx = \\frac{8}{3}',
    icon: '📊',
  },
  area_sinx: {
    src: '/models/area-under-curve-sinx.glb',
    title: 'Area Under Curve: sin(x)',
    description: 'Riemann sum for y = sin(x), bounds [0, π], n = 12',
    formula: '\\int_0^{\\pi} \\sin(x)\\,dx = 2',
    icon: '📈',
  },
  area_between: {
    src: '/models/area-between-curves.glb',
    title: 'Area Between Two Curves',
    description: 'Region between y = x and y = x², bounds [0, 1]',
    formula: '\\int_0^1 (x - x^2)\\,dx = \\frac{1}{6}',
    icon: '🟣',
  },
  tangent_parabola: {
    src: '/models/tangent-line-parabola.glb',
    title: 'Tangent Line on Parabola',
    description: 'Tangent line to y = x² at point (1, 1)',
    formula: 'y - 1 = 2(x - 1)',
    icon: '📐',
  },
  tangent_saddle: {
    src: '/models/tangent-plane-saddle.glb',
    title: 'Tangent Plane on Surface',
    description: 'Tangent plane to z = x² - y² at the origin',
    formula: 'z = 0 \\text{ (tangent plane at origin)}',
    icon: '🏔️',
  },
  optimization_box: {
    src: '/models/optimization-box.glb',
    title: 'Optimization: Open Box',
    description: 'Open box with V = 32 cm³, minimum surface area',
    formula: 'S(x) = x^2 + \\frac{128}{x},\\quad x = 4,\\; h = 2',
    icon: '📦',
  },
}

export default function ARViewer({ selectedTopic }) {
  const model = AR_MODELS[selectedTopic]
  if (!model) return null

  return (
    <div className="flex flex-col gap-4">
      {/* model-viewer */}
      <div className="glass rounded-2xl overflow-hidden" style={{ minHeight: 360 }}>
        {/* @ts-ignore */}
        <model-viewer
          src={model.src}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          auto-rotate
          shadow-intensity="1"
          style={{ width: '100%', height: '360px', background: 'transparent' }}
          ar-scale="auto"
          camera-orbit="45deg 55deg 2.5m"
          environment-image="neutral"
          exposure="0.8"
        >
          <button slot="ar-button" className="ar-button">
            🔮 View in AR
          </button>
        </model-viewer>
      </div>

      {/* Info */}
      <div className="glass p-4 rounded-2xl">
        <h3 className="font-heading font-bold text-white text-lg mb-1">{model.title}</h3>
        <p className="text-white/50 text-sm mb-3">{model.description}</p>
        <BlockMathDisplay math={model.formula} />
      </div>

      {/* Instructions */}
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
