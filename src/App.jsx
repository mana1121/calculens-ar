import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TabBar from './components/Layout/TabBar.jsx'
import Landing from './pages/Landing.jsx'
import SnapSolve from './pages/SnapSolve.jsx'
import Chat from './pages/Chat.jsx'
import ARPage from './pages/ARPage.jsx'
import VisualizePage from './pages/VisualizePage.jsx'
import Formulas from './pages/Formulas.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/snap-solve" element={<SnapSolve />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/ar" element={<ARPage />} />
            <Route path="/visualize/:topic" element={<VisualizePage />} />
            <Route path="/formulas" element={<Formulas />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </AnimatePresence>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}
