import React, { FC, useState } from 'react'
import { saveAs } from 'file-saver'

interface DownloadButtonProps {
  imageData: string
  filename?: string
  className?: string
}

const DownloadButton: FC<DownloadButtonProps> = ({
  imageData,
  filename = 'vintage-photo.png',
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadCount, setDownloadCount] = useState(0)

  const handleDownload = async () => {
    if (!imageData || isDownloading) return

    try {
      setIsDownloading(true)
      
      // Convert data URL to blob
      const response = await fetch(imageData)
      const blob = await response.blob()
      
      // Use FileSaver.js to trigger download
      saveAs(blob, filename)
      
      setDownloadCount(prev => prev + 1)
      
      // Show success feedback
      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
      
    } catch (error) {
      console.error('Download failed:', error)
      setIsDownloading(false)
      alert('Download failed. Please try again.')
    }
  }

  const handleShare = async () => {
    if (!navigator.share || typeof navigator.share !== 'function') {
      // Fallback to download if share API not available
      handleDownload()
      return
    }

    try {
      const response = await fetch(imageData)
      const blob = await response.blob()
      const file = new File([blob], filename, { type: 'image/png' })

      await navigator.share({
        title: 'My Vintage Photo',
        text: 'Check out this vintage photo I just took!',
        files: [file]
      })
    } catch (error) {
      // Fallback to download if sharing fails
      handleDownload()
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 items-center justify-center ${className}`}>
      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!imageData || isDownloading}
        className={`
          btn-vintage flex items-center gap-2 justify-center min-w-[140px] flex-shrink-0
          ${isDownloading ? 'opacity-75 cursor-wait' : ''}
          ${!imageData ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title="Download your vintage photo"
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-vintage-cream rounded-full animate-spin border-t-transparent" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span>Download</span>
          </>
        )}
      </button>

      {/* Share Button (if supported) */}
      {navigator.share && typeof navigator.share === 'function' && (
        <button
          onClick={handleShare}
          disabled={!imageData || isDownloading}
          className="btn-vintage flex items-center gap-2 justify-center min-w-[120px] flex-shrink-0"
          title="Share your photo strip"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span>Share</span>
        </button>
      )}

      {/* Download Stats */}
      {downloadCount > 0 && (
        <div className="flex items-center gap-2 text-vintage-brown font-vintage text-sm whitespace-nowrap">
          <span>✅</span>
          <span>
            Downloaded {downloadCount} time{downloadCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  )
}

export default DownloadButton 