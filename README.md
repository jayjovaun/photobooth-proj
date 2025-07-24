# 📸 Vintage Photobooth

A modern web-based photobooth app that captures photos with beautiful vintage-style filters. Built with React + TypeScript and styled with Tailwind CSS.

![Vintage Photobooth](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## ✨ Features

- 📷 **Live Camera Feed** - Access webcam with getUserMedia API
- 🎨 **Vintage Filters** - Apply sepia, grayscale, vintage, and copper filters
- 📸 **Instant Capture** - Take snapshots with camera flash effect
- 💾 **Easy Download** - Save photos as PNG files
- 📱 **Mobile Responsive** - Works perfectly on phones and tablets
- 🎭 **Retro Styling** - Beautiful vintage-themed UI with custom fonts
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development
- 🚀 **Vercel Ready** - Deploy instantly to Vercel

## 🎯 Live Demo

[Try the app live on Vercel](https://your-app-name.vercel.app) *(Deploy to get your URL)*

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom vintage theme
- **Build Tool**: Vite
- **Camera**: HTML5 getUserMedia API
- **Image Processing**: Canvas API
- **File Handling**: FileSaver.js
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Modern browser with camera support
- Camera permissions enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vintage-photobooth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📦 Project Structure

```
vintage-photobooth/
├── public/
│   ├── camera-icon.svg          # Favicon
│   └── retro-frame.png         # Optional overlay frame
├── src/
│   ├── components/
│   │   ├── CameraView.tsx      # Webcam feed component
│   │   ├── FilterSelector.tsx  # Filter selection UI
│   │   ├── SnapshotButton.tsx  # Photo capture button
│   │   └── DownloadButton.tsx  # Save image functionality
│   ├── App.tsx                 # Main application
│   ├── main.tsx               # React entry point
│   └── index.css              # Tailwind + custom styles
├── tailwind.config.js         # Tailwind configuration
├── vite.config.ts            # Vite configuration
├── vercel.json               # Vercel deployment config
└── package.json              # Dependencies
```

## 🎨 Available Filters

| Filter | Description | Effect |
|--------|-------------|--------|
| **Original** | Natural colors | No filter applied |
| **Sepia** | Classic brown tone | Warm, nostalgic feel |
| **B&W** | Black & white | Timeless monochrome |
| **Vintage** | Old-school green tint | Retro film aesthetic |
| **Copper** | Warm copper tone | Rich, metallic finish |

## 🎯 Usage

1. **Allow Camera Access** - Grant permission when prompted
2. **Choose Filter** - Select from 5 vintage-style filters
3. **Take Photo** - Click the red shutter button or press spacebar
4. **Download** - Save your vintage masterpiece as PNG

### Keyboard Shortcuts

- `Space` - Take photo
- `1-5` - Select filters (planned feature)
- `Enter` - Download photo (planned feature)

## 🚀 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/your-username/vintage-photobooth)

### Manual Deploy

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Production Deploy**
   ```bash
   vercel --prod
   ```

The app will be live at your Vercel URL instantly!

## 🎨 Customization

### Adding New Filters

Edit `src/App.tsx` and add a new case to the `applyFilter` function:

```typescript
case 'yourfilter':
  for (let i = 0; i < data.length; i += 4) {
    // Your filter logic here
    data[i] = newRedValue
    data[i + 1] = newGreenValue
    data[i + 2] = newBlueValue
  }
  break
```

### Changing Colors

Edit `tailwind.config.js` to customize the vintage color palette:

```javascript
colors: {
  vintage: {
    cream: '#your-color',
    sepia: '#your-color',
    // ... more colors
  }
}
```

### Adding Frame Overlays

Place your frame image in `public/` and modify the `addVintageFrame` function in `App.tsx`.

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Camera access requires HTTPS in production.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

No environment variables required! The app works out of the box.

## 🐛 Troubleshooting

### Camera Not Working

- **Permissions**: Ensure camera permissions are granted
- **HTTPS**: Camera requires HTTPS in production
- **Browser**: Use a supported modern browser
- **Hardware**: Check if camera is available and not in use

### Filters Not Applying

- Clear browser cache and refresh
- Check browser console for errors
- Ensure Canvas API is supported

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-filter`)
3. Commit your changes (`git commit -m 'Add amazing filter'`)
4. Push to the branch (`git push origin feature/amazing-filter`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Vite](https://vitejs.dev) for the blazing fast build tool
- [FileSaver.js](https://github.com/eligrey/FileSaver.js) for file downloads
- [Google Fonts](https://fonts.google.com) for the retro typography

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/vintage-photobooth/issues) page
2. Create a new issue if needed
3. Join our [Discussions](https://github.com/your-username/vintage-photobooth/discussions)

---

**Made with ❤️ and lots of ☕**

*Ready to capture some vintage memories? Let's go! 📸* 