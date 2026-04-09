import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageHeader from '../components/Layout/PageHeader.jsx'
import MessageBubble, { TypingIndicator } from '../components/Chat/MessageBubble.jsx'
import { sendChatMessage, parseVizBlock, stripVizBlock } from '../services/claude-api.js'

const SUGGESTIONS = [
  'Find the derivative of y = x³ - 3x',
  'Volume of y=x² rotated about x-axis, [0,2]',
  'Evaluate lim x→1 (x²-1)/(x-1)',
  'Integrate ∫₀² x² dx',
]

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m CalcuLens AI 🤖\n\nI can help you with any calculus question — limits, derivatives, integrals, solids of revolution, optimization, and more!\n\nTry asking: "Find the derivative of y = x²" or "Find the volume of y=sin(x) rotated about the x-axis"',
      displayContent: 'Hello! I\'m CalcuLens AI 🤖\n\nI can help you with any calculus question — limits, derivatives, integrals, solids of revolution, optimization, and more!\n\nTry asking: "Find the derivative of y = x²" or "Find the volume of y=sin(x) rotated about the x-axis"',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [vizModal, setVizModal] = useState(null)
  const bottomRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    setInput('')

    const userMsg = { id: Date.now().toString(), role: 'user', content: text, displayContent: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    // Build history for API (exclude welcome msg, only user/assistant)
    const history = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    const streamingId = (Date.now() + 1).toString()

    try {
      // Add empty assistant message that will be updated as tokens stream in
      setMessages((prev) => [...prev, {
        id: streamingId,
        role: 'assistant',
        content: '',
        displayContent: '',
        streaming: true,
      }])

      const responseText = await sendChatMessage(history, (partialText) => {
        // Update the streaming message with each new token
        const display = stripVizBlock(partialText)
        setMessages((prev) => prev.map((m) =>
          m.id === streamingId
            ? { ...m, content: partialText, displayContent: display }
            : m
        ))
      })

      // Finalize: parse viz data from complete response
      const vizData = parseVizBlock(responseText)
      const displayContent = stripVizBlock(responseText)

      setMessages((prev) => prev.map((m) =>
        m.id === streamingId
          ? { ...m, content: responseText, displayContent, vizData, streaming: false }
          : m
      ))
    } catch (err) {
      setMessages((prev) => {
        // Remove the streaming placeholder if it exists
        const filtered = prev.filter((m) => m.id !== streamingId)
        return [
          ...filtered,
          {
            id: streamingId,
            role: 'assistant',
            content: `Sorry, there was an error: ${err.message}. Make sure the proxy server is running with \`npm run dev:server\`.`,
            displayContent: `Sorry, there was an error: ${err.message}. Make sure the proxy server is running with \`npm run dev:server\`.`,
          },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header */}
      <div
        className="px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.18) 0%, transparent 100%)' }}
      >
        <PageHeader title="Ask CalcuLens" subtitle="AI Calculus Tutor" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} onVisualize={setVizModal} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(s)}
                className="flex-shrink-0 px-3 py-2 glass rounded-xl text-xs text-[#9CA3AF] hover:text-[#A78BFA] transition-colors"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-24 md:pb-4 pt-2">
        <div className="glass flex items-end gap-3 p-3 rounded-2xl">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Ask a calculus question... (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder-[#6B7280] max-h-32"
            style={{ lineHeight: '1.5' }}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-40 flex-shrink-0 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #6B3FA0, #8B5CF6)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.40)' }}
          >
            ↑
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
