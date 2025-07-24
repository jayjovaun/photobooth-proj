import React, { FC } from 'react'
import { FilterType, FrameColor, StripLayout } from '../App'

interface PhotoStripControlsProps {
  shotCount: number
  layout: StripLayout
  filter: FilterType
  frameColor: FrameColor
  caption: string
  includeDate: boolean
  onShotCountChange: (count: number) => void
  onLayoutChange: (layout: StripLayout) => void
  onFilterChange: (filter: FilterType) => void
  onFrameColorChange: (color: FrameColor) => void
  onCaptionChange: (caption: string) => void
  onDateToggle: (include: boolean) => void
}

const filterOptions: { value: FilterType; label: string; emoji: string }[] = [
  { value: 'none', label: 'Original', emoji: '📷' },
  { value: 'sepia', label: 'Sepia', emoji: '🟤' },
  { value: 'grayscale', label: 'B&W', emoji: '⚫' },
  { value: 'vintage', label: 'Vintage', emoji: '🟢' },
  { value: 'copper', label: 'Copper', emoji: '🟠' },
  { value: 'blackwhite', label: 'B&W+', emoji: '⚪' },
  { value: 'washedblue', label: 'Washed', emoji: '🔵' }
]

const frameColorOptions: { value: FrameColor; label: string; color: string }[] = [
  { value: 'white', label: 'White', color: '#ffffff' },
  { value: 'cream', label: 'Cream', color: '#f5ecd8' },
  { value: 'black', label: 'Black', color: '#2a2a2a' },
  { value: 'dustypink', label: 'Dusty Pink', color: '#e6b3c7' }
]

const PhotoStripControls: FC<PhotoStripControlsProps> = ({
  shotCount,
  layout,
  filter,
  frameColor,
  caption,
  includeDate,
  onShotCountChange,
  onLayoutChange,
  onFilterChange,
  onFrameColorChange,
  onCaptionChange,
  onDateToggle
}) => {
  return (
    <div className="space-y-6">
      {/* Shot Count */}
      <div className="vintage-card p-4">
        <h3 className="font-retro text-sm text-vintage-dark mb-3">
          📸 Number of Shots
        </h3>
        <div className="flex gap-2">
          {[2, 3, 4].map((count) => (
            <button
              key={count}
              onClick={() => onShotCountChange(count)}
              className={`
                px-4 py-2 rounded-md font-vintage text-sm transition-all duration-200
                ${shotCount === count 
                  ? 'bg-vintage-brown text-vintage-cream ring-2 ring-vintage-olive' 
                  : 'bg-vintage-sepia text-vintage-dark hover:bg-vintage-brown hover:text-vintage-cream'
                }
              `}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="vintage-card p-4">
        <h3 className="font-retro text-sm text-vintage-dark mb-3">
          📐 Strip Layout
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onLayoutChange('vertical')}
            className={`
              px-4 py-2 rounded-md font-vintage text-sm transition-all duration-200 flex items-center gap-2
              ${layout === 'vertical' 
                ? 'bg-vintage-brown text-vintage-cream ring-2 ring-vintage-olive' 
                : 'bg-vintage-sepia text-vintage-dark hover:bg-vintage-brown hover:text-vintage-cream'
              }
            `}
          >
            📱 Vertical
          </button>
          <button
            onClick={() => onLayoutChange('horizontal')}
            className={`
              px-4 py-2 rounded-md font-vintage text-sm transition-all duration-200 flex items-center gap-2
              ${layout === 'horizontal' 
                ? 'bg-vintage-brown text-vintage-cream ring-2 ring-vintage-olive' 
                : 'bg-vintage-sepia text-vintage-dark hover:bg-vintage-brown hover:text-vintage-cream'
              }
            `}
          >
            💻 Horizontal
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="vintage-card p-4">
        <h3 className="font-retro text-sm text-vintage-dark mb-3">
          🎨 Filter
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`
                px-3 py-2 rounded-md font-vintage text-xs transition-all duration-200 flex items-center gap-2
                ${filter === option.value 
                  ? 'bg-vintage-brown text-vintage-cream ring-2 ring-vintage-olive' 
                  : 'bg-vintage-sepia text-vintage-dark hover:bg-vintage-brown hover:text-vintage-cream'
                }
              `}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Frame Color */}
      <div className="vintage-card p-4">
        <h3 className="font-retro text-sm text-vintage-dark mb-3">
          🖼️ Frame Color
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {frameColorOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFrameColorChange(option.value)}
              className={`
                px-3 py-2 rounded-md font-vintage text-xs transition-all duration-200 flex items-center gap-2
                ${frameColor === option.value 
                  ? 'ring-2 ring-vintage-olive' 
                  : 'hover:scale-105'
                }
              `}
              style={{ 
                backgroundColor: option.color,
                color: option.value === 'black' ? '#ffffff' : '#2a2a2a',
                border: '2px solid #8b4513'
              }}
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-400"
                style={{ backgroundColor: option.color }}
              />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="vintage-card p-4">
        <h3 className="font-retro text-sm text-vintage-dark mb-3">
          ✏️ Caption
        </h3>
        <input
          type="text"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Add a caption..."
          maxLength={30}
          className="w-full px-3 py-2 border-2 border-vintage-brown rounded-md font-vintage text-sm
                     bg-vintage-cream text-vintage-dark placeholder-vintage-brown placeholder-opacity-60
                     focus:outline-none focus:ring-2 focus:ring-vintage-olive"
        />
        <p className="text-xs text-vintage-brown mt-1 opacity-60">
          {caption.length}/30 characters
        </p>
      </div>

      {/* Date Toggle */}
      <div className="vintage-card p-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeDate}
            onChange={(e) => onDateToggle(e.target.checked)}
            className="w-4 h-4 text-vintage-brown border-vintage-brown rounded 
                       focus:ring-vintage-olive focus:ring-2"
          />
          <span className="font-vintage text-sm text-vintage-dark">
            📅 Include Date
          </span>
        </label>
      </div>
    </div>
  )
}

export default PhotoStripControls 