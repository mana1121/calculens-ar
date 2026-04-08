import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export function InlineMathDisplay({ math }) {
  try {
    return <InlineMath math={math} />
  } catch {
    return <span className="font-mono text-[#A78BFA]">{math}</span>
  }
}

export function BlockMathDisplay({ math }) {
  try {
    return (
      <div className="overflow-x-auto py-2">
        <BlockMath math={math} />
      </div>
    )
  } catch {
    return <pre className="font-mono text-[#A78BFA] text-sm">{math}</pre>
  }
}

// Renders text that may contain $..$ inline or $$...$$ display math
export default function MathDisplay({ content, className = '' }) {
  if (!content) return null

  const parts = []
  let remaining = content
  let key = 0

  while (remaining.length > 0) {
    // Check for $$...$$ display math
    const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/)
    // Check for $...$ inline math
    const inlineMatch = remaining.match(/\$((?:[^$]|\\.)*?)\$/)

    let firstMatch = null
    let matchType = null

    if (displayMatch && inlineMatch) {
      if (displayMatch.index <= inlineMatch.index) {
        firstMatch = displayMatch
        matchType = 'display'
      } else {
        firstMatch = inlineMatch
        matchType = 'inline'
      }
    } else if (displayMatch) {
      firstMatch = displayMatch
      matchType = 'display'
    } else if (inlineMatch) {
      firstMatch = inlineMatch
      matchType = 'inline'
    }

    if (!firstMatch) {
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }

    // Text before match
    if (firstMatch.index > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, firstMatch.index)}</span>)
    }

    if (matchType === 'display') {
      parts.push(<BlockMathDisplay key={key++} math={firstMatch[1]} />)
    } else {
      parts.push(<InlineMathDisplay key={key++} math={firstMatch[1]} />)
    }

    remaining = remaining.slice(firstMatch.index + firstMatch[0].length)
  }

  return <span className={className}>{parts}</span>
}
