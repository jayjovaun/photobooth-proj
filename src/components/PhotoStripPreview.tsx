import React, { FC } from 'react'
import { CapturedPhoto, StripLayout } from '../App'
import DownloadButton from './DownloadButton'

interface PhotoStripPreviewProps {
  photos: CapturedPhoto[]
  finalStrip: string | null
  layout: StripLayout
  caption: string
  onRetake: () => void
}

const PhotoStripPreview: FC<PhotoStripPreviewProps> = ({
  photos,
  finalStrip,
  layout,
  caption,
  onRetake
}) => {
  if (photos.length === 0) return null

  return (
    <div className="vintage-card p-6 animate-fade-in">
      {finalStrip ? (
        // Final Strip View
        <div className="text-center space-y-6">
          <h2 className="font-retro text-lg text-vintage-dark">
            📸 Your Photo Strip
          </h2>
          
          <div className="flex justify-center">
            <img 
              src={finalStrip}
              alt="Final photo strip"
              className="border-4 border-vintage-brown shadow-2xl rounded-lg max-w-full h-auto
                         max-h-96 object-contain"
            />
          </div>
          
          {caption && (
            <p className="font-chisel text-vintage-brown italic text-lg">
              "{caption}"
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
            <button
              onClick={onRetake}
              className="btn-vintage flex-shrink-0"
            >
              🔄 Take New Strip
            </button>
            
            <DownloadButton 
              imageData={finalStrip}
              filename={`photo-strip-${Date.now()}.png`}
              className="flex-shrink-0"
            />
          </div>
        </div>
      ) : (
        // Individual Photos View
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-retro text-lg text-vintage-dark mb-2">
              📷 Captured Photos
            </h2>
            <p className="font-vintage text-vintage-brown text-sm">
              Creating your {layout} photo strip...
            </p>
          </div>
          
          <div className={`
            grid gap-4 justify-center
            ${layout === 'horizontal' 
              ? `grid-cols-${Math.min(photos.length, 4)} max-w-4xl mx-auto` 
              : 'grid-cols-1 max-w-sm mx-auto'
            }
          `}>
            {photos.map((photo, index) => (
              <div 
                key={photo.timestamp}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img 
                  src={photo.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-auto rounded-lg border-2 border-vintage-brown shadow-lg
                           max-w-48 mx-auto"
                />
                <div className="absolute top-2 left-2 bg-vintage-brown text-vintage-cream
                               px-2 py-1 rounded-full text-xs font-vintage">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          {/* Loading Animation */}
          <div className="text-center">
            <div className="loading-dots">
              <div style={{'--delay': 0} as React.CSSProperties}></div>
              <div style={{'--delay': 1} as React.CSSProperties}></div>
              <div style={{'--delay': 2} as React.CSSProperties}></div>
            </div>
            <p className="mt-2 font-vintage text-vintage-dark text-sm">
              Composing your photo strip...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotoStripPreview 