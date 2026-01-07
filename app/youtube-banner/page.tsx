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

// CDN base for tracksuit images
const CDN_BASE = "https://sb.oracleboxing.com/tracksuit"

// Helper to proxy images through our API to avoid CORS issues
const proxyUrl = (url: string) => `/api/proxy-image?url=${encodeURIComponent(url)}`

// Image URLs
const IMAGE_URLS = {
  left: proxyUrl(`${CDN_BASE}/ob_black_1.webp`),
  right: proxyUrl(`${CDN_BASE}/ob_steel_1.webp`),
  topLeft: proxyUrl(`${CDN_BASE}/ob_grey_2.webp`),
  topRight: proxyUrl(`${CDN_BASE}/ob_forest_1.webp`),
  bottomLeft: proxyUrl(`${CDN_BASE}/ob_hazel_1.webp`),
  bottomRight: proxyUrl(`${CDN_BASE}/ob_black_4.webp`),
}

type LoadedImages = Record<keyof typeof IMAGE_URLS, HTMLImageElement>

export default function YouTubeBannerPage() {
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
        // Font might not be available, use fallback
        setFontsLoaded(true)
      }
    }
    loadFonts()
  }, [])

  // Draw the banner on canvas
  const drawBanner = useCallback((ctx: CanvasRenderingContext2D, includeGuides: boolean) => {
    // Clear and fill background
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT)

    // Draw radial gradient background
    const gradient = ctx.createRadialGradient(
      BANNER_WIDTH / 2, BANNER_HEIGHT / 2, 0,
      BANNER_WIDTH / 2, BANNER_HEIGHT / 2, BANNER_WIDTH / 2
    )
    gradient.addColorStop(0, "#1a1a1a")
    gradient.addColorStop(0.7, "#0a0a0a")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, BANNER_WIDTH, BANNER_HEIGHT)

    if (images) {
      // Draw TV area decorative images (top)
      const tvAreaHeight = SAFE_ZONE_TOP - 50

      if (images.topLeft) {
        const aspectRatio = images.topLeft.width / images.topLeft.height
        const imgHeight = tvAreaHeight
        const imgWidth = imgHeight * aspectRatio
        ctx.globalAlpha = 0.3
        ctx.drawImage(images.topLeft, BANNER_WIDTH / 2 - imgWidth - 32, 0, imgWidth, imgHeight)
      }

      if (images.topRight) {
        const aspectRatio = images.topRight.width / images.topRight.height
        const imgHeight = tvAreaHeight
        const imgWidth = imgHeight * aspectRatio
        ctx.globalAlpha = 0.3
        ctx.drawImage(images.topRight, BANNER_WIDTH / 2 + 32, 0, imgWidth, imgHeight)
      }

      // Draw TV area decorative images (bottom)
      if (images.bottomLeft) {
        const aspectRatio = images.bottomLeft.width / images.bottomLeft.height
        const imgHeight = tvAreaHeight
        const imgWidth = imgHeight * aspectRatio
        ctx.globalAlpha = 0.3
        ctx.drawImage(images.bottomLeft, BANNER_WIDTH / 2 - imgWidth - 32, BANNER_HEIGHT - imgHeight, imgWidth, imgHeight)
      }

      if (images.bottomRight) {
        const aspectRatio = images.bottomRight.width / images.bottomRight.height
        const imgHeight = tvAreaHeight
        const imgWidth = imgHeight * aspectRatio
        ctx.globalAlpha = 0.3
        ctx.drawImage(images.bottomRight, BANNER_WIDTH / 2 + 32, BANNER_HEIGHT - imgHeight, imgWidth, imgHeight)
      }

      ctx.globalAlpha = 1

      // Draw main product images
      const productHeight = 400
      const centerY = DESKTOP_TOP + DESKTOP_VISIBLE.height / 2

      if (images.left) {
        const aspectRatio = images.left.width / images.left.height
        const imgWidth = productHeight * aspectRatio
        ctx.drawImage(images.left, 48, centerY - productHeight / 2, imgWidth, productHeight)
      }

      if (images.right) {
        const aspectRatio = images.right.width / images.right.height
        const imgWidth = productHeight * aspectRatio
        ctx.drawImage(images.right, BANNER_WIDTH - 48 - imgWidth, centerY - productHeight / 2, imgWidth, productHeight)
      }
    }

    // Draw text content in safe zone
    const centerX = BANNER_WIDTH / 2
    const centerY = BANNER_HEIGHT / 2

    // Main headline - "LAST CALL"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Create gradient for headline
    const textGradient = ctx.createLinearGradient(centerX - 400, centerY - 100, centerX + 400, centerY + 50)
    textGradient.addColorStop(0, "#ffffff")
    textGradient.addColorStop(1, "#FEF08A")

    ctx.font = '700 140px "ClashDisplay", system-ui, sans-serif'
    ctx.fillStyle = textGradient
    ctx.fillText("LAST CALL", centerX, centerY - 80)

    // Subheadline
    ctx.font = '500 32px system-ui, sans-serif'
    ctx.fillStyle = "#ffffff"
    ctx.letterSpacing = "0.3em"
    ctx.fillText("ORACLE BOXING TRACKSUITS", centerX, centerY + 10)

    // Divider line
    const lineGradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0)
    lineGradient.addColorStop(0, "transparent")
    lineGradient.addColorStop(0.5, "#FEF08A")
    lineGradient.addColorStop(1, "transparent")
    ctx.strokeStyle = lineGradient
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 100, centerY + 50)
    ctx.lineTo(centerX + 100, centerY + 50)
    ctx.stroke()

    // Urgency info - stacked
    ctx.font = '600 28px system-ui, sans-serif'
    ctx.fillStyle = "#FEF08A"
    ctx.fillText("Sale ends January 13th", centerX, centerY + 90)

    ctx.fillStyle = "#ef4444"
    ctx.fillText("<10 remaining", centerX, centerY + 130)

    // Draw guides if enabled
    if (includeGuides) {
      ctx.setLineDash([20, 10])
      ctx.lineWidth = 4

      // TV Full Area (green)
      ctx.strokeStyle = "#22c55e"
      ctx.strokeRect(2, 2, BANNER_WIDTH - 4, BANNER_HEIGHT - 4)

      // Label
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

    // Create a new canvas for export without guides
    const exportCanvas = document.createElement("canvas")
    exportCanvas.width = BANNER_WIDTH
    exportCanvas.height = BANNER_HEIGHT
    const ctx = exportCanvas.getContext("2d")
    if (!ctx) return

    drawBanner(ctx, false)

    const link = document.createElement("a")
    link.download = "oracle-boxing-youtube-banner.png"
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
            <h1 style={{ fontSize: "18px", fontWeight: 600 }}>YouTube Banner Designer</h1>
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
