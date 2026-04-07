/**
 * Draw styled X and Y axes with labels and tick marks on a 2D canvas
 */
export function drawAxes(ctx, W, H, PAD, domain, yRange, options = {}) {
  const { showGrid = true, xLabel = 'x', yLabel = 'y' } = options

  // Grid
  if (showGrid) {
    ctx.strokeStyle = 'rgba(187,222,251,0.4)'
    ctx.lineWidth = 1
    for (let i = Math.ceil(domain[0]); i <= Math.floor(domain[1]); i++) {
      const cx = PAD + ((i - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD)
      ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke()
    }
    for (let i = Math.ceil(yRange[0]); i <= Math.floor(yRange[1]); i++) {
      const cy = H - PAD - ((i - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke()
    }
  }

  // Axis lines — thick and dark
  ctx.strokeStyle = '#0D1B2A'
  ctx.lineWidth = 2.5

  // X-axis
  const yZero = H - PAD - ((0 - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)
  const yClamp = Math.max(PAD, Math.min(H - PAD, yZero))
  ctx.beginPath(); ctx.moveTo(PAD, yClamp); ctx.lineTo(W - PAD, yClamp); ctx.stroke()
  // Arrow
  ctx.beginPath(); ctx.moveTo(W - PAD, yClamp); ctx.lineTo(W - PAD - 10, yClamp - 5); ctx.lineTo(W - PAD - 10, yClamp + 5); ctx.closePath()
  ctx.fillStyle = '#0D1B2A'; ctx.fill()

  // Y-axis
  const xZero = PAD + ((0 - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD)
  const xClamp = Math.max(PAD, Math.min(W - PAD, xZero))
  ctx.beginPath(); ctx.moveTo(xClamp, H - PAD); ctx.lineTo(xClamp, PAD); ctx.stroke()
  // Arrow
  ctx.beginPath(); ctx.moveTo(xClamp, PAD); ctx.lineTo(xClamp - 5, PAD + 10); ctx.lineTo(xClamp + 5, PAD + 10); ctx.closePath()
  ctx.fillStyle = '#0D1B2A'; ctx.fill()

  // Axis labels — big and bold
  ctx.font = 'bold 18px "Space Grotesk", sans-serif'
  ctx.fillStyle = '#0D1B2A'
  ctx.fillText(xLabel, W - PAD + 8, yClamp + 5)
  ctx.fillText(yLabel, xClamp - 5, PAD - 10)

  // Tick marks and numbers
  ctx.font = 'bold 13px monospace'
  ctx.fillStyle = '#64748B'
  for (let i = Math.ceil(domain[0]); i <= Math.floor(domain[1]); i++) {
    if (i === 0) continue
    const cx = PAD + ((i - domain[0]) / (domain[1] - domain[0])) * (W - 2 * PAD)
    // Tick
    ctx.beginPath(); ctx.moveTo(cx, yClamp - 5); ctx.lineTo(cx, yClamp + 5); ctx.strokeStyle = '#64748B'; ctx.lineWidth = 2; ctx.stroke()
    // Number
    ctx.fillText(i.toString(), cx - 4, yClamp + 16)
  }
  for (let i = Math.ceil(yRange[0]); i <= Math.floor(yRange[1]); i++) {
    if (i === 0) continue
    const cy = H - PAD - ((i - yRange[0]) / (yRange[1] - yRange[0])) * (H - 2 * PAD)
    // Tick
    ctx.beginPath(); ctx.moveTo(xClamp - 5, cy); ctx.lineTo(xClamp + 5, cy); ctx.strokeStyle = '#64748B'; ctx.lineWidth = 2; ctx.stroke()
    // Number
    ctx.textAlign = 'right'
    ctx.fillText(i.toString(), xClamp - 8, cy + 4)
    ctx.textAlign = 'left'
  }

  // Origin "0"
  ctx.fillStyle = '#90CAF9'
  ctx.font = '11px monospace'
  ctx.fillText('0', xClamp - 12, yClamp + 16)
}
