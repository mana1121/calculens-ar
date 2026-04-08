import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CameraView({ onCapture }) {
  const videoRef = useRef()
  const streamRef = useRef()
  const [cameraActive, setCameraActive] = useState(false)
  const [flash, setFlash] = useState(false)
  const [error, setError] = useState(null)

  const startCamera = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCameraActive(true)
    } catch (err) {
      setError('Camera access denied. Please use the upload option below.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setCameraActive(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    setFlash(true)
    setTimeout(() => setFlash(false), 300)

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    const dataURL = canvas.toDataURL('image/jpeg', 0.9)
    const base64 = dataURL.split(',')[1]
    stopCamera()
    onCapture({ base64, dataURL, mediaType: 'image/jpeg' })
  }, [onCapture, stopCamera])

  const handleUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataURL = reader.result
      const base64 = dataURL.split(',')[1]
      const mediaType = file.type || 'image/jpeg'
      onCapture({ base64, dataURL, mediaType })
    }
    reader.readAsDataURL(file)
  }, [onCapture])

  return (
    <div className="flex flex-col h-full">
      {/* Viewfinder */}
      <div className="relative flex-1 min-h-[320px] glass rounded-2xl overflow-hidden mb-4">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: 'rgba(26, 11, 46, 0.92)' }}>
            <div className="text-5xl">📸</div>
            <p className="font-heading text-[#E5E7EB] text-sm text-center px-6">
              Point at your calculus question and snap!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startCamera}
              className="btn-primary px-6 py-3 text-sm"
            >
              Open Camera
            </motion.button>
          </div>
        )}

        {cameraActive && (
          <>
            {/* Guide overlay */}
            <div className="absolute inset-4 border-2 border-white/60 rounded-xl pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />
            </div>
            <p className="absolute top-6 left-0 right-0 text-center text-white/90 text-xs font-heading pointer-events-none" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              Align question within frame
            </p>
          </>
        )}

        {/* Flash effect */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(248, 113, 113, 0.10)', border: '1px solid rgba(248, 113, 113, 0.40)' }}>
          <p className="text-[#FCA5A5] text-sm text-center">{error}</p>
        </div>
      )}

      {/* Capture / Upload buttons */}
      <div className="flex gap-3 items-center justify-center mb-4">
        {cameraActive ? (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stopCamera}
              className="btn-secondary px-5 py-3 text-sm"
            >
              ✕ Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-glow-lg"
              style={{ background: 'linear-gradient(135deg, #6B3FA0, #8B5CF6)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.55)' }}
            >
              📷
            </motion.button>
          </>
        ) : (
          <label className="btn-secondary px-6 py-3 text-sm cursor-pointer flex items-center gap-2">
            📁 Upload Image
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
    </div>
  )
}
