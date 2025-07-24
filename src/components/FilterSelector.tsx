import { FC } from 'react'
import { FilterType } from '../App'

interface FilterSelectorProps {
  selectedFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

interface FilterOption {
  value: FilterType
  label: string
  emoji: string
  description: string
}

const filterOptions: FilterOption[] = [
  {
    value: 'none',
    label: 'Original',
    emoji: '📷',
    description: 'Natural colors'
  },
  {
    value: 'sepia',
    label: 'Sepia',
    emoji: '🟤',
    description: 'Classic brown tone'
  },
  {
    value: 'grayscale',
    label: 'B&W',
    emoji: '⚫',
    description: 'Black & white'
  },
  {
    value: 'vintage',
    label: 'Vintage',
    emoji: '🟢',
    description: 'Old-school green tint'
  },
  {
    value: 'copper',
    label: 'Copper',
    emoji: '🟠',
    description: 'Warm copper tone'
  }
]

const FilterSelector: FC<FilterSelectorProps> = ({
  selectedFilter,
  onFilterChange
}) => {
  return (
    <div className="w-full max-w-md">
      <h3 className="font-retro text-sm text-vintage-dark mb-3 text-center">
        🎨 Choose Filter
      </h3>
      
      {/* Mobile-friendly grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`
              filter-btn flex flex-col items-center p-3 min-h-[80px] text-center
              ${selectedFilter === option.value ? 'active' : ''}
            `}
            title={option.description}
          >
            <span className="text-xl mb-1">{option.emoji}</span>
            <span className="text-xs font-semibold">{option.label}</span>
          </button>
        ))}
      </div>
      
      {/* Filter Description */}
      <div className="mt-3 text-center">
        <p className="text-vintage-dark font-vintage text-sm opacity-80">
          {filterOptions.find(f => f.value === selectedFilter)?.description}
        </p>
      </div>
      
      {/* Preview Samples */}
      <div className="mt-4 flex justify-center space-x-2">
        {filterOptions.map((option) => (
          <div
            key={option.value}
            className={`
              w-8 h-8 rounded border-2 transition-all duration-200 cursor-pointer
              ${selectedFilter === option.value 
                ? 'border-vintage-brown scale-110' 
                : 'border-vintage-sepia hover:border-vintage-brown hover:scale-105'
              }
            `}
            onClick={() => onFilterChange(option.value)}
            style={{
              background: getFilterPreviewColor(option.value)
            }}
            title={`${option.label} - ${option.description}`}
          />
        ))}
      </div>
    </div>
  )
}

const getFilterPreviewColor = (filter: FilterType): string => {
  switch (filter) {
    case 'sepia':
      return 'linear-gradient(45deg, #deb887, #d2b48c)'
    case 'grayscale':
      return 'linear-gradient(45deg, #808080, #a0a0a0)'
    case 'vintage':
      return 'linear-gradient(45deg, #6b8e23, #8fbc8f)'
    case 'copper':
      return 'linear-gradient(45deg, #b87333, #cd853f)'
    default:
      return 'linear-gradient(45deg, #f5ecd8, #deb887)'
  }
}

export default FilterSelector 