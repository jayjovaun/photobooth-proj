import React, { FC } from 'react'

interface MultiShotCaptureProps {
  shotCount: number
  currentShot: number
  countdown: number
  isCapturing: boolean
  isMultiShot: boolean
  onStartMultiShot: () => void
  onSingleCapture: () => void
  disabled?: boolean
}

const MultiShotCapture: FC<MultiShotCaptureProps> = ({
  shotCount,
  currentShot,
  countdown,
  isCapturing,
  isMultiShot,
  onStartMultiShot,
  onSingleCapture,
  disabled = false
}) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Multi-Shot Button */}
      <button
        onClick={onStartMultiShot}
        disabled={disabled || isCapturing || isMultiShot}
        className={`
          btn-shutter flex items-center justify-center relative overflow-hidden
          ${isMultiShot ? 'animate-pulse scale-110' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={`Take ${shotCount} photos with countdown`}
      >
        {/* Main Icon */}
        <div className={`
          transition-all duration-200 relative
          ${isCapturing ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}
        `}>
          {countdown > 0 ? (
            <div className="text-3xl font-bold text-white animate-bounce">
              {countdown}
            </div>
          ) : isCapturing ? (
            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
          ) : (
            <div className="flex flex-col items-center">
              <svg 
                width="28" 
                height="28" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="drop-shadow-lg"
              >
                <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.8"/>
                <circle cx="12" cy="12" r="5" fill="white"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
              {shotCount > 1 && (
                <div className="text-xs font-bold mt-1">
                  x{shotCount}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Capture Effect Ring */}
        {isCapturing && (
          <div className="absolute inset-0 border-4 border-white rounded-full animate-ping opacity-75" />
        )}
      </button>
      
      {/* Status */}
      <div className="text-center">
        <p className="font-vintage text-vintage-dark text-sm font-semibold">
          {isMultiShot ? (
            countdown > 0 ? (
              `Get ready... ${countdown}`
            ) : isCapturing ? (
              '📸 Capturing...'
            ) : (
              `Photo ${currentShot + 1} of ${shotCount}`
            )
          ) : (
            `Take ${shotCount} Photos`
          )}
        </p>
        
        {/* Progress Indicator */}
        {isMultiShot && (
          <div className="mt-2 flex justify-center space-x-1">
            {Array.from({ length: shotCount }, (_, i) => (
              <div
                key={i}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${i < currentShot 
                    ? 'bg-vintage-olive' 
                    : i === currentShot 
                      ? 'bg-vintage-brown animate-pulse' 
                      : 'bg-vintage-sepia'
                  }
                `}
              />
            ))}
          </div>
        )}
        
        {/* Single Shot Option */}
        {!isMultiShot && (
          <button
            onClick={onSingleCapture}
            disabled={disabled || isCapturing}
            className="mt-3 px-4 py-2 bg-vintage-sepia text-vintage-dark font-vintage text-sm
                       rounded-md hover:bg-vintage-brown hover:text-vintage-cream
                       transition-all duration-200 disabled:opacity-50"
          >
            📷 Single Shot
          </button>
        )}
      </div>
      
      {/* Keyboard Hint */}
      <p className="font-vintage text-vintage-brown text-xs opacity-60 text-center">
        Press Space ⎵ for multi-shot
      </p>
    </div>
  )
}

export default MultiShotCapture 