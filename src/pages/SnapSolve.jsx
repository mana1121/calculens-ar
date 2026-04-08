import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/Layout/PageHeader.jsx'
import CameraView from '../components/SnapSolve/CameraView.jsx'
import SolutionDisplay from '../components/SnapSolve/SolutionDisplay.jsx'
import Loading from '../components/Shared/Loading.jsx'
import { solveFromImage } from '../services/claude-api.js'

const STATES = { CAMERA: 'camera', LOADING: 'loading', SOLUTION: 'solution' }

export default function SnapSolve() {
  const [state, setState] = useState(STATES.CAMERA)
  const [capturedImage, setCapturedImage] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleCapture = async ({ base64, dataURL, mediaType }) => {
    setCapturedImage({ base64, dataURL, mediaType })
    setState(STATES.LOADING)
    setError(null)

    try {
      const data = await solveFromImage(base64, mediaType)
      setResult(data)
      setState(STATES.SOLUTION)
    } catch (err) {
      setError(err.message)
      setState(STATES.CAMERA)
    }
  }

  const handleReset = () => {
    setState(STATES.CAMERA)
    setCapturedImage(null)
    setResult(null)
    setError(null)
  }

  const handleVisualize = () => {
    if (!result?.topic) return
    const topicMap = {
      solid_of_revolution: 'solid-of-revolution',
      integration: 'integration',
      derivatives: 'derivatives',
      limits: 'limits',
      optimization: 'optimization',
      rate_of_change: 'rate-of-change',
    }
    const path = topicMap[result.topic] || 'solid-of-revolution'
    window.location.href = `/visualize/${path}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <PageHeader title="Snap & Solve" subtitle="Snap a question → AI solves it → Visualize in 3D" />

      <div className="flex-1 px-4 pb-6 overflow-y-auto">
        {error && (
          <div className="p-4 rounded-2xl mb-4" style={{ background: 'rgba(248, 113, 113, 0.10)', border: '1px solid rgba(248, 113, 113, 0.40)' }}>
            <p className="text-[#FCA5A5] text-sm">⚠️ {error}</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Make sure ANTHROPIC_API_KEY is set in .env and the proxy server is running.</p>
          </div>
        )}

        {state === STATES.CAMERA && (
          <CameraView onCapture={handleCapture} />
        )}

        {state === STATES.LOADING && (
          <div className="flex flex-col items-center gap-4 py-12">
            {capturedImage?.dataURL && (
              <img
                src={capturedImage.dataURL}
                alt="Captured"
                className="w-32 h-32 object-cover rounded-2xl glass"
              />
            )}
            <Loading message="CalcuLens is reading your question..." />
          </div>
        )}

        {state === STATES.SOLUTION && (
          <SolutionDisplay
            imageDataURL={capturedImage?.dataURL}
            result={result}
            onReset={handleReset}
            onVisualize={handleVisualize}
          />
        )}
      </div>
    </motion.div>
  )
}
