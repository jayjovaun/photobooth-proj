import React, { FC } from 'react'

interface SnapshotButtonProps {
  onCapture: () => void
  isCapturing: boolean
  disabled?: boolean
}

const SnapshotButton: FC<SnapshotButtonProps> = ({
  onCapture,
  isCapturing,
  disabled = false
}) => {
  const handleClick = () => {
    console.log('Snapshot button clicked, capturing:', isCapturing, 'disabled:', disabled)
    if (!disabled && !isCapturing) {
      onCapture()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={disabled || isCapturing}
        className={`
          btn-shutter flex items-center justify-center
          ${isCapturing ? 'animate-pulse scale-110' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          relative overflow-hidden
        `}
        aria-label="Take Photo"
        title="Click to capture photo"
      >
        {/* Shutter Icon */}
        <div className={`
          transition-all duration-200
          ${isCapturing ? 'scale-75 opacity-50' : 'scale-100 opacity-100'}
        `}>
          {isCapturing ? (
            <div className="w-6 h-6 border-2 border-white rounded-full animate-spin border-t-transparent" />
          ) : (
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="drop-shadow-lg"
            >
              <circle cx="12" cy="12" r="8" fill="currentColor" opacity="0.8"/>
              <circle cx="12" cy="12" r="5" fill="white"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          )}
        </div>
        
        {/* Capture Effect Ring */}
        {isCapturing && (
          <div className="absolute inset-0 border-4 border-white rounded-full animate-ping opacity-75" />
        )}
      </button>
      
      {/* Button Label */}
      <p className="mt-2 font-vintage text-vintage-dark text-sm font-semibold">
        {isCapturing ? 'Capturing...' : 'Take Photo'}
      </p>
      
      {/* Keyboard Shortcut Hint */}
      <p className="mt-1 font-vintage text-vintage-brown text-xs opacity-60">
        Press Space ⎵
      </p>
    </div>
  )
}

export default SnapshotButton 