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
const API_KEY = (process.env.ANTHROPIC_API_KEY || '').replace(/[\r\n\s]/g, '')

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
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
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: `You are CalcuLens AI — an exam-marker calculus tutor. Analyze the math question in the image and produce the SHORTEST correct full-marks solution.

MARKING RULES (follow strictly):
- Use the standard method an examiner expects (formula → substitute → simplify → answer).
- Every step earns a mark. Skip nothing that earns marks; skip everything that doesn't.
- ALWAYS include +C for indefinite integrals.
- ALWAYS include units for optimisation, related rates, area (sq units), volume (cubic units).
- Give exact form first (e.g. 32π/5), decimal approximation second (≈ 20.11).
- Name the rule on the line you apply it (Chain Rule, By Parts, L'Hôpital, Disc Method, etc.).
- For limits: state "0/0" or "∞/∞" before applying L'Hôpital.
- For optimisation: confirm max/min via f'' test or sign chart.
- For related rates: differentiate implicitly first, substitute values LAST.

Each "description" field should be a SHORT phrase (max 10 words) — not a paragraph. The "math" field is the actual LaTeX working line.

Respond ONLY in this exact JSON format (no markdown, no backticks, no extra text):
{
  "question_text": "the question as text",
  "topic": "limits|derivatives|integration|solid_of_revolution|optimization|rate_of_change",
  "solution": {
    "steps": [
      {"step": 1, "description": "Set up using disc method", "math": "V = \\\\pi\\\\int_0^2 (x^2)^2\\\\,dx"},
      {"step": 2, "description": "Simplify integrand", "math": "V = \\\\pi\\\\int_0^2 x^4\\\\,dx"},
      {"step": 3, "description": "Apply power rule", "math": "V = \\\\pi\\\\left[\\\\frac{x^5}{5}\\\\right]_0^2"}
    ],
    "final_answer": "V = \\\\frac{32\\\\pi}{5} \\\\approx 20.11 \\\\text{ cubic units}"
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
