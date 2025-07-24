/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          cream: '#f5ecd8',
          sepia: '#deb887',
          brown: '#8b4513',
          dark: '#3a3a3a',
          olive: '#6b8e23',
          copper: '#b87333',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        retro: ['Press Start 2P', 'monospace'],
        vintage: ['Roboto Mono', 'monospace'],
        chisel: ['Playfair Display', 'serif'],
      },
      animation: {
        'flash': 'flash 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        flash: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
} 