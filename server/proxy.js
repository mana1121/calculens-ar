import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { config } from 'dotenv'

config()

const app = express()
const PORT = 3001

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://calculens-ar.vercel.app', /\.vercel\.app$/] }))
app.use(express.json({ limit: '20mb' }))

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: system || '',
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
})

// Snap & Solve endpoint (with image)
app.post('/api/snap', async (req, res) => {
  try {
    const { imageBase64, mediaType } = req.body

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: `You are CalcuLens AI, a calculus tutor for students.
Analyze the math question in this image.
Respond in this JSON format:
{
  "question_text": "the question as text",
  "topic": "limits|derivatives|integration|solid_of_revolution|optimization|rate_of_change",
  "solution": {
    "steps": [
      {"step": 1, "description": "...", "math": "LaTeX expression"},
      {"step": 2, "description": "...", "math": "LaTeX expression"}
    ],
    "final_answer": "LaTeX expression"
  },
  "can_visualize": true,
  "visualization_type": "tangent_line|area_under_curve|solid_of_revolution|riemann_sum|optimization|rate_of_change",
  "visualization_params": {
    "function": "x^2",
    "domain": [-2, 2],
    "axis_of_rotation": "x-axis",
    "bounds": [0, 2]
  }
}
Respond ONLY with valid JSON, no markdown, no backticks.`,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: imageBase64,
                },
              },
              {
                type: 'text',
                text: 'Analyze this calculus question and provide a step-by-step solution in the specified JSON format.',
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error('Snap error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`CalcuLens proxy running on http://localhost:${PORT}`)
})
