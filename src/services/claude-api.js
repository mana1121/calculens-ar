const API_URL = import.meta.env.VITE_API_URL || 'https://calculens-ar.onrender.com'

const CHAT_SYSTEM = `You are CalcuLens AI, a friendly and encouraging calculus tutor.
You help students with all calculus topics including limits, derivatives, integration, solids of revolution, optimization, and related rates.

When solving problems:
1. Identify the topic and method
2. Show clear step-by-step working
3. Use LaTeX for all math expressions (wrap in $...$ for inline, $$...$$ for display)
4. Be encouraging and supportive
5. Respond in English

If the problem involves any of these, add a JSON block at the end wrapped in <viz> tags:
- Area under curve / definite integral
- Solid of revolution
- Tangent line / derivative at a point
- Riemann sums
- Min/max optimization

<viz>
{
  "type": "solid_of_revolution|area_under_curve|tangent_line|riemann_sum|optimization",
  "function": "math expression in JS format e.g. Math.pow(x,2)",
  "latex_function": "x^2",
  "domain": [-2, 2],
  "point": 1.5,
  "axis": "x-axis",
  "bounds": [0, 2]
}
</viz>

Only include <viz> when visualization would genuinely help understanding.`

export async function sendChatMessage(messages) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system: CHAT_SYSTEM }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.content?.[0]?.text || ''
}

export async function solveFromImage(imageBase64, mediaType = 'image/jpeg') {
  const res = await fetch(`${API_URL}/api/snap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mediaType }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  const text = data.content?.[0]?.text || ''
  try {
    return JSON.parse(text)
  } catch {
    // Try to extract JSON if wrapped in markdown
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse AI response')
  }
}

export function parseVizBlock(text) {
  const match = text.match(/<viz>([\s\S]*?)<\/viz>/)
  if (!match) return null
  try {
    return JSON.parse(match[1])
  } catch {
    return null
  }
}

export function stripVizBlock(text) {
  return text.replace(/<viz>[\s\S]*?<\/viz>/g, '').trim()
}
