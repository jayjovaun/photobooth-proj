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

        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported. Please use HTTPS and a modern browser.')
        }

        // Check if we're on HTTPS (required for camera in production)
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
          throw new Error('Camera requires HTTPS connection. Please use https:// in the URL.')
        }

        // Request camera access with more specific constraints for production
        const constraints = {
          video: {
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
            facingMode: 'user',
            aspectRatio: { ideal: 16/9 }
          },
          audio: false
        }

        console.log('Requesting camera access...', constraints)
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        console.log('Camera stream obtained:', stream)

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream
          
          // Force video to load and be ready for capture
          await new Promise((resolve, reject) => {
            if (!videoRef.current) return reject('Video ref lost')
            
            const video = videoRef.current
            let resolved = false
            
            const checkVideoReady = () => {
              if (resolved) return
              
              console.log('Checking video ready state:', {
                readyState: video.readyState,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
                currentTime: video.currentTime
              })
              
              // More robust readiness check for production
              if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
                resolved = true
                console.log('Video is ready!')
                resolve(true)
              }
            }
            
            // Multiple event listeners for better compatibility
            video.onloadedmetadata = checkVideoReady
            video.onloadeddata = checkVideoReady  
            video.oncanplay = checkVideoReady
            video.oncanplaythrough = checkVideoReady
            
            video.onerror = (e) => {
              console.error('Video error:', e)
              if (!resolved) {
                resolved = true
                reject(e)
              }
            }
            
            // Force video to start loading if stream is available
            if (video.srcObject && video.readyState === 0) {
              console.log('Forcing video to load...')
              video.load()
            }
            
            // If video is already ready, resolve immediately
            if (video.readyState >= 2 && video.videoWidth > 0) {
              checkVideoReady()
            }
            
            // Extended timeout for production environments
            setTimeout(() => {
              if (!resolved) {
                console.log('Video load timeout - checking current state...')
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                  console.log('Video has dimensions, proceeding...')
                  resolved = true
                  resolve(true)
                } else {
                  console.log('Video still not ready, forcing resolution...')
                  resolved = true
                  resolve(true) // Still try to proceed
                }
              }
            }, 10000) // Longer timeout for production
          })

          // Play the video
          await videoRef.current.play()
          console.log('Video playing successfully')
          setHasPermission(true)
        }
      } catch (err) {
        console.error('Camera initialization error:', err)
        setHasPermission(false)
        
        if (err instanceof Error) {
          if (err.name === 'NotAllowedError') {
            setError('Camera access denied. Please click the camera icon in your browser address bar and allow camera access, then refresh.')
          } else if (err.name === 'NotFoundError') {
            setError('No camera found. Please connect a camera and refresh the page.')
          } else if (err.name === 'NotSupportedError' || err.message.includes('not supported')) {
            setError('Camera not supported. Please use Chrome, Firefox, or Safari on a secure connection (HTTPS).')
          } else if (err.name === 'NotReadableError') {
            setError('Camera is being used by another application. Please close other camera apps and refresh.')
          } else {
            setError(`Camera error: ${err.message}. Please check permissions and try again.`)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(initCamera, 100)

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (stream) {
        console.log('Cleaning up camera stream')
        stream.getTracks().forEach(track => {
          track.stop()
          console.log('Stopped track:', track.kind)
        })
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
          controls={false}
          webkit-playsinline="true"
          style={{ 
            transform: 'scaleX(-1)', // Mirror the video like a selfie camera
            width: '100%',
            height: 'auto',
            minHeight: '300px'
          }}
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