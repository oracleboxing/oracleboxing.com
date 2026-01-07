"use client"

import { useRef, useState, useEffect, useCallback } from "react"

// YouTube Banner Dimensions
const BANNER_WIDTH = 2560
const BANNER_HEIGHT = 1440

// Safe zones
const SAFE_ZONE = { width: 1546, height: 423 }
const DESKTOP_VISIBLE = { width: 2560, height: 423 }

// Calculate positions (centered)
const SAFE_ZONE_TOP = (BANNER_HEIGHT - SAFE_ZONE.height) / 2
const SAFE_ZONE_LEFT = (BANNER_WIDTH - SAFE_ZONE.width) / 2
const DESKTOP_TOP = (BANNER_HEIGHT - DESKTOP_VISIBLE.height) / 2

// CDN base for images
const CDN_BASE = "https://sb.oracleboxing.com/Website"

// Helper to proxy images through our API to avoid CORS issues
const proxyUrl = (url: string) => `/api/proxy-image?url=${encodeURIComponent(url)}`

// Image URLs
const IMAGE_URLS = {
  coaching: proxyUrl(`${CDN_BASE}/OpenAI%20Playground%202026-01-04%20at%2011.53.24.png`),
  feedback: proxyUrl(`${CDN_BASE}/feedback_1.webp`),
  progress: proxyUrl(`${CDN_BASE}/progress2.webp`),
  refund: proxyUrl(`${CDN_BASE}/refund.webp`),
}

type LoadedImages = Record<keyof typeof IMAGE_URLS, HTMLImageElement>

export default function ChallengeBannerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(0.35)
  const [showGuides, setShowGuides] = useState(true)
  const [images, setImages] = useState<LoadedImages | null>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Load images
  useEffect(() => {
    const loadImages = async () => {
      const entries = Object.entries(IMAGE_URLS) as [keyof typeof IMAGE_URLS, string][]
      const loaded: Partial<LoadedImages> = {}

      await Promise.all(
        entries.map(
          ([key, url]) =>
            new Promise<void>((resolve) => {
              const img = new Image()
              img.crossOrigin = "anonymous"
              img.onload = () => {
                loaded[key] = img
                resolve()
              }
              img.onerror = () => {
                console.error(`Failed to load ${key}`)
                resolve()
              }
              img.src = url
            })
        )
      )

      setImages(loaded as LoadedImages)
    }

    loadImages()
  }, [])

  // Load fonts
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await document.fonts.load('700 72px "ClashDisplay"')
        setFontsLoaded(true)
      } catch {
        setFontsLoaded(true)
      }
    }
    loadFonts()
  }, [])

  // Draw the banner on canvas
  const drawBanner = useCallback((ctx: CanvasRenderingContext2D, includeGuides: boolean) => {
    // Background - warm cream color like the website
    ctx.fillStyle = "#FFFCF5"
    ctx.fillRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT)

    // Draw diagonal stripes pattern across entire background
    ctx.save()
    ctx.strokeStyle = "rgba(55, 50, 47, 0.05)"
    ctx.lineWidth = 1
    const stripeSpacing = 20

    // Diagonal stripes from top-left to bottom-right
    for (let i = -200; i < 400; i++) {
      const x = i * stripeSpacing
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + BANNER_HEIGHT, BANNER_HEIGHT)
      ctx.stroke()
    }
    ctx.restore()

    // Helper function to draw rounded image (contain - no cropping)
    const drawRoundedImage = (img: HTMLImageElement, x: number, y: number, maxW: number, maxH: number, r: number) => {
      // Calculate dimensions to fit image without cropping (contain)
      const imgAspect = img.width / img.height
      const boxAspect = maxW / maxH
      let drawW: number, drawH: number, drawX: number, drawY: number

      if (imgAspect > boxAspect) {
        // Image is wider - fit to width
        drawW = maxW
        drawH = maxW / imgAspect
        drawX = x
        drawY = y + (maxH - drawH) / 2
      } else {
        // Image is taller - fit to height
        drawH = maxH
        drawW = maxH * imgAspect
        drawX = x + (maxW - drawW) / 2
        drawY = y
      }

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(drawX, drawY, drawW, drawH, r)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      ctx.restore()
    }

    if (images) {
      // Images positioned in the DESKTOP strip but OUTSIDE the mobile safe zone
      // Desktop strip: full width, 423px height, centered vertically
      // Safe zone: 1546px centered within desktop strip
      // So we have (2560 - 1546) / 2 = 507px on each side for images

      // Full height of desktop strip
      const imgHeight = DESKTOP_VISIBLE.height
      const imgWidth = 480
      const imgY = DESKTOP_TOP
      const cornerRadius = 12

      // Left image - positioned in the left margin of desktop strip, full height
      if (images.coaching) {
        ctx.globalAlpha = 1
        drawRoundedImage(images.coaching, 20, imgY, imgWidth, imgHeight, cornerRadius)
      }

      // Right image - positioned in the right margin of desktop strip, full height
      if (images.feedback) {
        ctx.globalAlpha = 1
        drawRoundedImage(images.feedback, BANNER_WIDTH - 20 - imgWidth, imgY, imgWidth, imgHeight, cornerRadius)
      }

      // TV area images (corners - only visible on TV)
      const tvImgSize = 320
      const tvPadding = 60

      // Top left
      if (images.progress) {
        ctx.globalAlpha = 0.8
        drawRoundedImage(images.progress, tvPadding, tvPadding, tvImgSize, tvImgSize * 0.7, cornerRadius)
      }

      // Top right
      if (images.refund) {
        ctx.globalAlpha = 0.8
        drawRoundedImage(images.refund, BANNER_WIDTH - tvPadding - tvImgSize, tvPadding, tvImgSize, tvImgSize * 0.7, cornerRadius)
      }

      // Bottom left
      if (images.coaching) {
        ctx.globalAlpha = 0.6
        drawRoundedImage(images.coaching, tvPadding, BANNER_HEIGHT - tvPadding - tvImgSize * 0.7, tvImgSize, tvImgSize * 0.7, cornerRadius)
      }

      // Bottom right
      if (images.feedback) {
        ctx.globalAlpha = 0.6
        drawRoundedImage(images.feedback, BANNER_WIDTH - tvPadding - tvImgSize, BANNER_HEIGHT - tvPadding - tvImgSize * 0.7, tvImgSize, tvImgSize * 0.7, cornerRadius)
      }

      ctx.globalAlpha = 1
    }

    // Draw text content in safe zone (must fit within 1546 x 423)
    const centerX = BANNER_WIDTH / 2
    const centerY = BANNER_HEIGHT / 2

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // "OPEN NOW" badge at top
    ctx.font = '700 24px system-ui, sans-serif'
    ctx.fillStyle = "#16a34a"
    ctx.fillText("🟢  OPEN NOW  •  DOORS CLOSE JAN 31ST", centerX, centerY - 70)

    // "21-Day Challenge" - main headline (sized to fit safe zone width of 1546px)
    // At 90px, "21-Day Challenge" is approx 1100px wide - fits comfortably
    ctx.font = '700 90px "ClashDisplay", system-ui, sans-serif'
    ctx.fillStyle = "#37322F"
    ctx.fillText("21-Day Challenge", centerX, centerY + 15)

    // Urgency info
    ctx.font = '700 28px system-ui, sans-serif'
    ctx.fillStyle = "#dc2626"
    ctx.fillText("ONLY 30 SPOTS AVAILABLE", centerX, centerY + 95)

    // Features (fits within safe zone)
    ctx.font = '500 20px system-ui, sans-serif'
    ctx.fillStyle = "#49423D"
    ctx.fillText("Live Coaching  •  Video Feedback  •  Structured Curriculum", centerX, centerY + 145)

    // Draw guides if enabled
    if (includeGuides) {
      ctx.setLineDash([20, 10])
      ctx.lineWidth = 4

      // TV Full Area (green)
      ctx.strokeStyle = "#22c55e"
      ctx.strokeRect(2, 2, BANNER_WIDTH - 4, BANNER_HEIGHT - 4)

      ctx.setLineDash([])
      ctx.fillStyle = "#22c55e"
      ctx.fillRect(8, 8, 140, 24)
      ctx.fillStyle = "#000000"
      ctx.font = '700 12px system-ui, sans-serif'
      ctx.textAlign = "left"
      ctx.fillText("TV (2560×1440)", 14, 24)

      // Desktop Visible (yellow)
      ctx.setLineDash([20, 10])
      ctx.strokeStyle = "#eab308"
      ctx.strokeRect(2, DESKTOP_TOP, BANNER_WIDTH - 4, DESKTOP_VISIBLE.height)

      ctx.setLineDash([])
      ctx.fillStyle = "#eab308"
      ctx.fillRect(8, DESKTOP_TOP + 8, 160, 24)
      ctx.fillStyle = "#000000"
      ctx.fillText("Desktop (2560×423)", 14, DESKTOP_TOP + 24)

      // Mobile Safe Zone (red)
      ctx.setLineDash([20, 10])
      ctx.strokeStyle = "#ef4444"
      ctx.strokeRect(SAFE_ZONE_LEFT, SAFE_ZONE_TOP, SAFE_ZONE.width, SAFE_ZONE.height)

      ctx.setLineDash([])
      ctx.fillStyle = "#ef4444"
      ctx.fillRect(SAFE_ZONE_LEFT + 8, SAFE_ZONE_TOP + 8, 200, 24)
      ctx.fillStyle = "#ffffff"
      ctx.fillText("Mobile Safe Zone (1546×423)", SAFE_ZONE_LEFT + 14, SAFE_ZONE_TOP + 24)
    }
  }, [images])

  // Redraw canvas when dependencies change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawBanner(ctx, showGuides)
  }, [images, showGuides, fontsLoaded, drawBanner])

  const handleExport = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = BANNER_WIDTH
    exportCanvas.height = BANNER_HEIGHT
    const ctx = exportCanvas.getContext("2d")
    if (!ctx) return

    drawBanner(ctx, false)

    const link = document.createElement("a")
    link.download = "oracle-boxing-21day-challenge-banner.png"
    link.href = exportCanvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#171717",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Controls Bar */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "#262626",
        borderBottom: "1px solid #404040",
        padding: "16px 24px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "1280px",
          margin: "0 auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>21-Day Challenge Banner</h1>
            <div style={{ fontSize: "14px", color: "#a3a3a3" }}>
              {BANNER_WIDTH} × {BANNER_HEIGHT}px
            </div>
            {!images && (
              <div style={{ fontSize: "14px", color: "#fbbf24" }}>
                Loading images...
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px", color: "#a3a3a3" }}>Zoom:</span>
              {[0.25, 0.35, 0.5, 0.75, 1].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: zoom === z ? "#eab308" : "#404040",
                    color: zoom === z ? "#000000" : "#ffffff",
                    fontWeight: zoom === z ? 500 : 400,
                  }}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>

            {/* Safe Zone Toggle */}
            <button
              onClick={() => setShowGuides(!showGuides)}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "14px",
                border: "none",
                cursor: "pointer",
                backgroundColor: showGuides ? "#2563eb" : "#404040",
                color: "#ffffff",
              }}
            >
              {showGuides ? "Hide" : "Show"} Guides
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={!images}
              style={{
                padding: "8px 24px",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: 500,
                border: "none",
                cursor: !images ? "not-allowed" : "pointer",
                backgroundColor: !images ? "#525252" : "#16a34a",
                color: "#ffffff",
              }}
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>

      {/* Banner Container */}
      <div style={{ paddingTop: "80px", paddingBottom: "80px", overflow: "auto" }}>
        <div
          style={{
            margin: "0 auto",
            width: BANNER_WIDTH * zoom,
            height: BANNER_HEIGHT * zoom,
          }}
        >
          <canvas
            ref={canvasRef}
            width={BANNER_WIDTH}
            height={BANNER_HEIGHT}
            style={{
              width: BANNER_WIDTH * zoom,
              height: BANNER_HEIGHT * zoom,
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Info Panel */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#262626",
        borderTop: "1px solid #404040",
        padding: "12px 24px",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "14px",
          color: "#a3a3a3",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "4px",
                marginRight: "8px",
                backgroundColor: "#ef4444"
              }} />
              Mobile Safe Zone
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "4px",
                marginRight: "8px",
                backgroundColor: "#eab308"
              }} />
              Desktop Visible
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "4px",
                marginRight: "8px",
                backgroundColor: "#22c55e"
              }} />
              TV Full Canvas
            </span>
          </div>
          <div>
            Upload to: YouTube Studio → Customization → Branding → Banner image
          </div>
        </div>
      </div>
    </div>
  )
}
