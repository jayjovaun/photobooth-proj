import React, { useState, useRef, useCallback, useEffect } from 'react'
import CameraView from './components/CameraView'
import PhotoStripControls from './components/PhotoStripControls'
import MultiShotCapture from './components/MultiShotCapture'
import PhotoStripPreview from './components/PhotoStripPreview'

export type FilterType = 'none' | 'sepia' | 'grayscale' | 'vintage' | 'copper' | 'blackwhite' | 'washedblue'

export type FrameColor = 'white' | 'cream' | 'black' | 'dustypink'

export type StripLayout = 'vertical' | 'horizontal'

export interface CapturedPhoto {
  dataUrl: string
  timestamp: number
}

interface PhotoSession {
  photos: CapturedPhoto[]
  settings: {
    shotCount: number
    layout: StripLayout
    filter: FilterType
    frameColor: FrameColor
    caption: string
    includeDate: boolean
  }
}

function App() {
  // Photo session state
  const [photoSession, setPhotoSession] = useState<PhotoSession>({
    photos: [],
    settings: {
      shotCount: 3,
      layout: 'vertical',
      filter: 'none',
      frameColor: 'white',
      caption: '',
      includeDate: true
    }
  })
  
  // Capture state
  const [isCapturing, setIsCapturing] = useState(false)
  const [isMultiShot, setIsMultiShot] = useState(false)
  const [currentShot, setCurrentShot] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [finalStrip, setFinalStrip] = useState<string | null>(null)
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stripCanvasRef = useRef<HTMLCanvasElement>(null)

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available')
      return null
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('Could not get canvas context')
      return null
    }

    // More flexible video readiness check for production
    const videoReady = video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0
    const hasStream = video.srcObject && video.srcObject.active

    console.log('Video status:', {
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      paused: video.paused,
      ended: video.ended,
      hasStream: hasStream,
      videoReady: videoReady
    })

    if (!videoReady) {
      console.error('Video not ready for capture. Trying to force capture anyway...')
      // Don't return null, try to capture anyway with fallback dimensions
    }

    // Set canvas dimensions with fallbacks
    const width = video.videoWidth > 0 ? video.videoWidth : 1280
    const height = video.videoHeight > 0 ? video.videoHeight : 720
    
    canvas.width = width
    canvas.height = height

    console.log('Capturing with dimensions:', { width, height })

    try {
      // Clear canvas first
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Mirror the image horizontally (like selfie camera)
      ctx.save()
      ctx.scale(-1, 1)
      
      // Draw video to canvas - this might fail silently if video isn't ready
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      ctx.restore()

      // Check if we actually drew something
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasData = imageData.data.some(pixel => pixel !== 0)
      
      if (!hasData) {
        console.error('No image data captured - canvas is blank')
        // Try again without mirroring
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        const retryImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const retryHasData = retryImageData.data.some(pixel => pixel !== 0)
        
        if (!retryHasData) {
          console.error('Still no image data - video stream might not be working')
          return null
        }
      }

      // Apply the selected filter
      applyFilter(ctx, canvas, photoSession.settings.filter)

      // Add vintage frame overlay
      addVintageFrame(ctx, canvas)

      // Get the image data
      const dataUrl = canvas.toDataURL('image/png', 0.9)
      console.log('Photo captured successfully, data URL length:', dataUrl.length)
      
      return {
        dataUrl,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error during photo capture:', error)
      return null
    }
  }, [photoSession.settings.filter])

  const startMultiShot = useCallback(async () => {
    setIsMultiShot(true)
    setCurrentShot(0)
    setPhotoSession(prev => ({ ...prev, photos: [] }))
    setFinalStrip(null)
    
    const takeShot = async (shotNumber: number) => {
      // Countdown
      for (let i = 3; i > 0; i--) {
        setCountdown(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      setCountdown(0)
      setIsCapturing(true)
      
      // Capture photo
      await new Promise(resolve => setTimeout(resolve, 200)) // Flash effect
      const photo = capturePhoto()
      
      if (photo) {
        setPhotoSession(prev => ({
          ...prev,
          photos: [...prev.photos, photo]
        }))
      }
      
      setIsCapturing(false)
      setCurrentShot(shotNumber + 1)
      
      // Pause between shots
      if (shotNumber < photoSession.settings.shotCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500))
      }
    }
    
    // Take all shots
    for (let i = 0; i < photoSession.settings.shotCount; i++) {
      await takeShot(i)
    }
    
    setIsMultiShot(false)
    setCountdown(0)
    setCurrentShot(0)
  }, [photoSession.settings.shotCount, capturePhoto])

  const handleSingleCapture = useCallback(async () => {
    setIsCapturing(true)
    
    setTimeout(() => {
      const photo = capturePhoto()
      if (photo) {
        setPhotoSession(prev => ({
          ...prev,
          photos: [photo]
        }))
      }
      setIsCapturing(false)
    }, 300)
  }, [capturePhoto])

  const applyFilter = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, filter: FilterType) => {
    if (filter === 'none') return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    switch (filter) {
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
        }
        break
      
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          data[i] = gray
          data[i + 1] = gray
          data[i + 2] = gray
        }
        break
      
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          // Create vintage green tint
          data[i] = Math.min(255, r * 0.8 + 20)
          data[i + 1] = Math.min(255, g * 0.9 + 30)
          data[i + 2] = Math.min(255, b * 0.6 + 10)
        }
        break
      
      case 'copper':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          data[i] = Math.min(255, (r * 0.7) + (g * 0.3) + 40)
          data[i + 1] = Math.min(255, (r * 0.4) + (g * 0.6) + 20)
          data[i + 2] = Math.min(255, (r * 0.2) + (g * 0.2) + (b * 0.4))
        }
        break
      
      case 'blackwhite':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
          data[i] = gray
          data[i + 1] = gray
          data[i + 2] = gray
        }
        break
      
      case 'washedblue':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          data[i] = Math.min(255, r * 0.8 + 10)
          data[i + 1] = Math.min(255, g * 0.85 + 15)
          data[i + 2] = Math.min(255, b * 1.1 + 25)
        }
        break
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const addVintageFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Add a simple vintage border effect
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(0.7, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.3)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add vintage noise/grain effect
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const alpha = Math.random() * 0.1
      
      ctx.fillStyle = `rgba(139, 69, 19, ${alpha})`
      ctx.fillRect(x, y, 1, 1)
    }
  }

  const createPhotoStrip = useCallback(() => {
    if (!stripCanvasRef.current || photoSession.photos.length === 0) return

    const canvas = stripCanvasRef.current
    const ctx = canvas.getContext('2d')!
    const { layout, frameColor, caption, includeDate } = photoSession.settings
    const photos = photoSession.photos

    // Photo dimensions and layout calculations
    const photoWidth = 300
    const photoHeight = 400
    const padding = 20
    const borderWidth = 10
    const captionHeight = includeDate || caption ? 80 : 20

    // Calculate canvas dimensions
    let canvasWidth: number
    let canvasHeight: number

    if (layout === 'vertical') {
      canvasWidth = photoWidth + (padding * 2) + (borderWidth * 2)
      canvasHeight = (photoHeight * photos.length) + (padding * (photos.length + 1)) + (borderWidth * 2) + captionHeight
    } else {
      canvasWidth = (photoWidth * photos.length) + (padding * (photos.length + 1)) + (borderWidth * 2)
      canvasHeight = photoHeight + (padding * 2) + (borderWidth * 2) + captionHeight
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Background
    const frameColors = {
      white: '#ffffff',
      cream: '#f5ecd8',
      black: '#2a2a2a',
      dustypink: '#e6b3c7'
    }
    
    ctx.fillStyle = frameColors[frameColor]
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw photos
    photos.forEach((photo, index) => {
      const img = new Image()
      img.onload = () => {
        let x: number, y: number

        if (layout === 'vertical') {
          x = borderWidth + padding
          y = borderWidth + padding + (index * (photoHeight + padding))
        } else {
          x = borderWidth + padding + (index * (photoWidth + padding))
          y = borderWidth + padding
        }

        // Draw photo with rounded corners
        ctx.save()
        ctx.beginPath()
        const radius = 8
        ctx.roundRect(x, y, photoWidth, photoHeight, radius)
        ctx.clip()
        ctx.drawImage(img, x, y, photoWidth, photoHeight)
        ctx.restore()

        // Add subtle border around each photo
        ctx.strokeStyle = '#cccccc'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(x, y, photoWidth, photoHeight, radius)
        ctx.stroke()

        // If this is the last photo, add caption and date
        if (index === photos.length - 1) {
          addCaptionAndDate(ctx, canvas, caption, includeDate, frameColor)
        }
      }
      img.src = photo.dataUrl
    })

    // Return the final image
    setTimeout(() => {
      const finalDataUrl = canvas.toDataURL('image/png', 0.9)
      setFinalStrip(finalDataUrl)
    }, 100)
  }, [photoSession])

  const addCaptionAndDate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, caption: string, includeDate: boolean, frameColor: FrameColor) => {
    const textColor = frameColor === 'black' ? '#ffffff' : '#2a2a2a'
    const y = canvas.height - 60

    ctx.fillStyle = textColor
    ctx.textAlign = 'center'

    if (caption) {
      ctx.font = 'bold 24px "Playfair Display", serif'
      ctx.fillText(caption, canvas.width / 2, y)
    }

    if (includeDate) {
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      ctx.font = '16px "Playfair Display", serif'
      ctx.fillText(date, canvas.width / 2, y + (caption ? 30 : 0))
    }
  }

  const handleRetake = () => {
    setPhotoSession(prev => ({ ...prev, photos: [] }))
    setFinalStrip(null)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent action if user is typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault()
          if (!isCapturing && !isMultiShot && photoSession.photos.length === 0) {
            startMultiShot()
          }
          break
        case 'Enter':
          event.preventDefault()
          if (finalStrip) {
            // Trigger download
            const downloadBtn = document.querySelector('[title="Download your photo strip"]') as HTMLButtonElement
            downloadBtn?.click()
          }
          break
        case 'Escape':
          event.preventDefault()
          if (photoSession.photos.length > 0 || finalStrip) {
            handleRetake()
          }
          break
        case 'Digit1':
          event.preventDefault()
          setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter: 'none' } }))
          break
        case 'Digit2':
          event.preventDefault()
          setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter: 'sepia' } }))
          break
        case 'Digit3':
          event.preventDefault()
          setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter: 'grayscale' } }))
          break
        case 'Digit4':
          event.preventDefault()
          setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter: 'vintage' } }))
          break
        case 'Digit5':
          event.preventDefault()
          setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter: 'copper' } }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [photoSession.photos.length, isCapturing, isMultiShot, finalStrip, startMultiShot])

  // Auto-create photo strip when all photos are captured
  useEffect(() => {
    if (photoSession.photos.length === photoSession.settings.shotCount && photoSession.photos.length > 0) {
      setTimeout(() => createPhotoStrip(), 500)
    }
  }, [photoSession.photos.length, photoSession.settings.shotCount, createPhotoStrip])

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-cream to-vintage-sepia p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="vintage-title mb-2">
            📸 Vintage Photo Booth
          </h1>
          <p className="vintage-subtitle">
            Capture multiple photos with classic retro style
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Camera Section */}
          <div className="xl:col-span-2">
            <div className="vintage-card p-6 mb-6">
              <CameraView 
                ref={videoRef}
                filter={photoSession.settings.filter}
                isCapturing={isCapturing}
              />
              
              <div className="mt-6 flex justify-center">
                <MultiShotCapture
                  shotCount={photoSession.settings.shotCount}
                  currentShot={currentShot}
                  countdown={countdown}
                  isCapturing={isCapturing}
                  isMultiShot={isMultiShot}
                  onStartMultiShot={startMultiShot}
                  onSingleCapture={handleSingleCapture}
                  disabled={photoSession.photos.length > 0}
                />
              </div>
            </div>

            {/* Photo Preview */}
            <PhotoStripPreview
              photos={photoSession.photos}
              finalStrip={finalStrip}
              layout={photoSession.settings.layout}
              caption={photoSession.settings.caption}
              onRetake={handleRetake}
            />
          </div>

          {/* Controls Sidebar */}
          <div className="xl:col-span-2">
            <PhotoStripControls
              shotCount={photoSession.settings.shotCount}
              layout={photoSession.settings.layout}
              filter={photoSession.settings.filter}
              frameColor={photoSession.settings.frameColor}
              caption={photoSession.settings.caption}
              includeDate={photoSession.settings.includeDate}
              onShotCountChange={(count) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, shotCount: count } }))
              }
              onLayoutChange={(layout) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, layout } }))
              }
              onFilterChange={(filter) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, filter } }))
              }
              onFrameColorChange={(frameColor) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, frameColor } }))
              }
              onCaptionChange={(caption) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, caption } }))
              }
              onDateToggle={(includeDate) => 
                setPhotoSession(prev => ({ ...prev, settings: { ...prev.settings, includeDate } }))
              }
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-vintage-brown font-vintage text-sm">
          <p>📸 Multi-Shot Photo Strip Booth</p>
          <p className="mt-1">Built by Josh Ivan Sartin</p>
        </footer>
      </div>

      {/* Hidden canvases for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={stripCanvasRef} className="hidden" />
    </div>
  )
}

export default App 