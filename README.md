# 🌌 Universe Viewer

An interactive 3D solar system and exoplanet explorer built with React and Three.js. Navigate through our solar system, explore distant star systems, and compare planets across the galaxy.

![Universe Viewer](https://img.shields.io/badge/React-19-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.182-green) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## ✨ Features

- **3D Solar System Visualization** - Explore planets, moons, and asteroid belts with realistic textures and orbital mechanics
- **Galactic Map** - Navigate a 3D star field to discover and visit real exoplanet systems from NASA's Exoplanet Archive
- **Real vs Compact Distances** - Toggle between accurate astronomical distances and a compact view for easier navigation
- **Planet Comparison** - Compare multiple planets side-by-side with detailed statistics
- **Time Controls** - Speed up, slow down, pause, or reverse time to observe orbital dynamics
- **Habitable Zone Visualization** - See the "Goldilocks zone" where liquid water could exist
- **Detailed Planet Info Cards** - View comprehensive information about each celestial body

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/BlackDereker/universe-viewer.git
cd universe-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Vite** - Build tool and dev server
- **Lucide React** - Icons

## 📁 Project Structure

```
universe-viewer/
├── public/
│   └── textures/        # Planet and star textures
├── src/
│   ├── components/      # React components
│   │   ├── panels/      # UI panels (Controls, Discovery, etc.)
│   │   └── ui/          # Reusable UI components
│   ├── data/            # Static data files
│   ├── services/        # API and data services
│   ├── shaders/         # GLSL shaders
│   └── utils/           # Utility functions
├── .github/
│   └── workflows/       # GitHub Actions
└── ...
```

## 🌐 Deployment

This project is configured for automatic deployment to GitHub Pages. Simply push to the `main` branch and GitHub Actions will build and deploy.

To deploy manually:

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Planet data from [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- Textures from various NASA/ESA sources
