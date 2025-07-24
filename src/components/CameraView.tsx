import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { FilterType } from '../App'

interface CameraViewProps {
  filter: FilterType
  isCapturing: boolean
}

const CameraView = forwardRef<HTMLVideoElement, CameraViewProps>(
  ({ filter, isCapturing }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement)

    useEffect(() => {
      let stream: MediaStream | null = null

      const initCamera = async () => {
        try {
          setIsLoading(true)
          setError(null)

          // Request camera access
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            },
            audio: false
          })

          if (videoRef.current) {
            videoRef.current.srcObject = stream
            await videoRef.current.play()
            setHasPermission(true)
          }
        } catch (err) {
          console.error('Camera access error:', err)
          setHasPermission(false)
          
          if (err instanceof Error) {
            if (err.name === 'NotAllowedError') {
              setError('Camera access denied. Please allow camera permissions and refresh the page.')
            } else if (err.name === 'NotFoundError') {
              setError('No camera found. Please ensure your device has a camera.')
            } else if (err.name === 'NotSupportedError') {
              setError('Camera not supported in this browser. Try Chrome, Firefox, or Safari.')
            } else {
              setError('Failed to access camera. Please check your permissions and try again.')
            }
          }
        } finally {
          setIsLoading(false)
        }
      }

      initCamera()

      // Cleanup function
      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }, [])

    const getFilterClass = (filterType: FilterType): string => {
      const baseClasses = "w-full h-auto camera-preview transition-all duration-300"
      
      switch (filterType) {
        case 'sepia':
          return `${baseClasses} sepia contrast-125 brightness-110`
        case 'grayscale':
          return `${baseClasses} grayscale contrast-125`
        case 'vintage':
          return `${baseClasses} sepia-[0.3] hue-rotate-[70deg] contrast-110 brightness-105`
        case 'copper':
          return `${baseClasses} sepia-[0.7] hue-rotate-[15deg] contrast-115 brightness-95 saturate-150`
        default:
          return baseClasses
      }
    }

    if (isLoading) {
      return (
        <div className="w-full aspect-video bg-vintage-sepia rounded-lg border-4 border-vintage-brown flex items-center justify-center">
          <div className="text-center">
            <div className="loading-dots mb-4">
              <div style={{'--delay': 0} as React.CSSProperties}></div>
              <div style={{'--delay': 1} as React.CSSProperties}></div>
              <div style={{'--delay': 2} as React.CSSProperties}></div>
            </div>
            <p className="text-vintage-dark font-vintage">
              Initializing camera...
            </p>
          </div>
        </div>
      )
    }

    if (error || hasPermission === false) {
      return (
        <div className="w-full aspect-video bg-vintage-sepia rounded-lg border-4 border-vintage-brown flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="font-retro text-lg text-vintage-dark mb-2">
              Camera Error
            </h3>
            <p className="text-vintage-dark font-vintage text-sm mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-vintage text-sm"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full">
        {/* Video Feed */}
        <video
          ref={videoRef}
          className={getFilterClass(filter)}
          autoPlay
          playsInline
          muted
        />
        
        {/* Capture Flash Effect */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white animate-flash rounded-lg pointer-events-none z-10" />
        )}
        
        {/* Retro Scanlines Effect */}
        <div className="absolute inset-0 scanlines rounded-lg pointer-events-none" />
        
        {/* Corner Decorations */}
        <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-vintage-brown opacity-60" />
        <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-vintage-brown opacity-60" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-vintage-brown opacity-60" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-vintage-brown opacity-60" />
        
        {/* Filter Indicator */}
        {filter !== 'none' && (
          <div className="absolute top-4 right-4 bg-vintage-brown text-vintage-cream px-3 py-1 rounded-full text-sm font-vintage opacity-80">
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </div>
        )}
      </div>
    )
  }
)

CameraView.displayName = 'CameraView'

export default CameraView 