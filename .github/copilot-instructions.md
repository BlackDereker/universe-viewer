# AI Coding Assistant Instructions for Universe Viewer

## Project Overview
Universe Viewer is a React + Three.js web application for visualizing exoplanet systems using NASA's Exoplanet Archive data. It combines real astrophysical data with interactive 3D rendering and UI controls for planetary exploration.

## Architecture

### Core Technology Stack
- **Frontend Framework**: React 19 with Vite (using rolldown)
- **3D Rendering**: Three.js via `@react-three/fiber` and `@react-three/drei`
- **Data Source**: NASA Exoplanet Archive (TAP API endpoint via proxy in vite.config.js)
- **UI Library**: Lucide React icons, inline styled-components
- **Styling**: CSS modules (App.css, index.css) + inline React styles with CSS variables

### Data Flow Architecture
```
NASA TAP API
    ↓ (fetched via /api proxy)
catalogService.js (caching layer)
    ↓
App.jsx state management (useState)
    ↓
SpaceCanvas (Three.js renderer)
    ├→ SolarSystem (planet/star group)
    ├→ Planet (individual orbits + meshes)
    │   └→ Moon (sub-orbits around planets)
    ├→ AsteroidBelt (instanced rendering for debris)
    ├→ HabitableZone (visualization ring)
    └→ CameraController (automated focus)
    
UIOverlay (controls panel)
    ├→ Search/Discovery interface
    ├→ System/Display toggles
    └→ Favorites (localStorage)
```

### Key State Management (App.jsx)
- `systems`: Array of loaded planetary systems
- `currentSystem`: Active system being visualized
- `selectedPlanet`: Clicked planet for detail view
- `useRealDistances`: Toggle orbital scale (real Kepler law vs compact for visibility)
- `timeSpeed`: Simulation speed multiplier (0-10x)
- `showHabitableZone`: Toggle habitable zone ring visualization

## Critical Patterns

### 1. Orbital Mechanics & Distance Scaling
**Pattern**: Dual-distance system to balance scientific accuracy with visual clarity.

- **actualDistance**: Kepler's third law (period² ∝ distance³), calculated from orbital periods
- **orderedDistance**: Collision-aware compact spacing, ensures visibility
- Toggle controlled by `useRealDistances` state
- Smooth interpolation via `THREE.MathUtils.lerp()` when switching modes
- **HabitableZone**: Uses interpolation logic to map real AU distances to compact visualization (see interpolateCompact function)

### 2. Performance & Instanced Rendering
**Pattern**: Use `InstancedMesh` for large numbers of similar objects (asteroids).
- **AsteroidBelt**: Renders thousands of asteroids using a single draw call.
- **Dynamic Updates**: Matrix updates performed in `useFrame` using a `dummy` Object3D to avoid object creation.
- **Scaling**: Supports both real and compact distance modes via radius interpolation.

### 3. Data Fetching & Caching (catalogService.js)
- **NASA TAP URL** uses CSV format with fields: pl_name, hostname, pl_rade, pl_orbper, pl_orbsmax, st_teff, st_rad, discoverymethod, disc_year
- **CSV Parsing**: Handles NASA comments (lines starting with #), quoted values
- **Single catalog cache**: `catalogCache` variable persists across multiple API calls
- **System queries**: Group by hostname, derive star properties from temperature curve (M/K/G/F/A/O classification)
- **Special case**: Solar System hardcoded separately (getSolarSystemData) not in NASA catalog

### 3. Color & Visual Encoding
- **Star colors**: Derived from temperature using Stefan-Boltzmann law mapping to visible spectrum (red dwarfs #ff4400 to blue #aaccff)
- **Planet colors**: Assigned deterministically via `getRandomPlanetColor(index)` array (ensures consistency)
- **Emissive materials**: Toggle on hover/selection for visual feedback

### 4. Procedural Generation
- **Rings**: Gas giants (radius > 6 Earth radii) get 50% chance of procedurally generated rings. Marked as `isProcedural` in the `rings` object.
- **Moons**: Planets > 2 Earth radii get procedurally generated moons in exoplanet systems. Marked as `moonsProcedural: true` on the planet object.
- **Disclaimer**: Both trigger visual disclaimers in the UI detail panel.
- **Not scientifically accurate**: Uses random inner/outer ratios and counts, visual-only indicator of planet status.
- Component: [Rings.jsx](src/components/Rings.jsx), [Moon.jsx](src/components/Moon.jsx)

### 5. Camera & Interaction (CameraController.jsx)
- **Three.js useFrame hook**: Runs every frame for smooth camera transitions
- **Lerp-based animation**: Smoothly interpolates camera position and controls.target
- **Transition flag**: isTransitioning tracks whether user just clicked planet (close zoom) vs deselected (recenter)
- **OrbitControls**: Managed through @react-three/drei, enabled/disabled via controls.enabled

### 6. UI State Isolation
**UIOverlay.jsx** manages independent state layers:
- `browseMode`: Featured/Random/Favorites/StarType filters (not passed to canvas)
- `searchTerm` + `searchResults`: Ephemeral UI state for discovery
- `isCollapsed`: Sidebar collapse animation (CSS transform translateX)- **System Planets List**: Allows direct selection and camera focus on planets in the current system.- Separates discovery UX from 3D visualization concerns

## Build & Development Commands

```bash
npm run dev       # Vite HMR dev server (http://localhost:5173)
npm run build     # Production bundle (vite build)
npm run preview   # Preview production build locally
npm run lint      # ESLint validation
```

## Key File Purposes

| File | Purpose |
|------|---------|
| [src/App.jsx](src/App.jsx) | Global state, data loading, layout coordinator |
| [src/services/catalogService.js](src/services/catalogService.js) | NASA API abstraction, caching, filtering |
| [src/components/SpaceCanvas.jsx](src/components/SpaceCanvas.jsx) | Three.js Canvas, camera setup, effect composer (Bloom) |
| [src/components/SolarSystem.jsx](src/components/SolarSystem.jsx) | Star + planet group renderer |
| [src/components/Planet.jsx](src/components/Planet.jsx) | Individual orbit physics, mesh creation, selection handling |
| [src/components/Moon.jsx](src/components/Moon.jsx) | Sub-orbital physics for moons |
| [src/components/AsteroidBelt.jsx](src/components/AsteroidBelt.jsx) | Instanced rendering for large debris fields |
| [src/components/HabitableZone.jsx](src/components/HabitableZone.jsx) | Habitable zone ring with distance interpolation logic |
| [src/components/CameraController.jsx](src/components/CameraController.jsx) | Animated camera focus on planet selection |
| [src/components/UIOverlay.jsx](src/components/UIOverlay.jsx) | Sidebar navigation, search, controls panel |

## Common Implementation Tasks

### Adding a New Filter/Browse Mode
1. Add mode string to `browseMode` state checks in [UIOverlay.jsx](src/components/UIOverlay.jsx)
2. Create filter function in [catalogService.js](src/services/catalogService.js) (e.g., `getSystemsByMultiplePlanets()`)
3. Add button + styling in the filter tabs section
4. Wire function call in the `loadBrowseData` useEffect

### Adding Planet Details to Info Panel
1. Add property to planet object in [catalogService.js](src/services/catalogService.js) (line where planets are mapped)
2. Access via `selectedPlanet.propertyName` in [UIOverlay.jsx](src/components/UIOverlay.jsx) planet-info section
3. Add stat-card div for new visualization

### Modifying Orbital Physics
- **Speed adjustments**: Edit multiplier in `useFrame` loop (currently `delta * planet.speed * timeSpeed * 100`)
- **Collision detection**: Modify margin/orderedDistance calculation in catalogService.js
- **Animation curve**: Replace `THREE.MathUtils.lerp()` with other easing functions (check Three.js docs)

### Texture Management
- Place textures in `public/textures/` directory
- Reference in catalogService.js as `/textures/filename.png`
- Use `<TexturedMaterial texture={path} />` wrapper for consistent texture loading

## ESLint & Code Style
- Uses @vitejs/plugin-react with Fast Refresh enabled
- React hooks rules enforced (dependencies arrays must be complete)
- No TypeScript currently (pure JSX) — maintain filename patterns

## Common Debugging Patterns
- **Missing planets**: Check NASA API response CSV parsing (filter logic, hostname matching case-sensitivity)
- **Camera frozen**: Verify controls.enabled state in CameraController
- **Distance scaling broken**: Check lerp direction and actual vs orderedDistance field names
- **Textures not loading**: Ensure public/textures/ path is accessible, no 404s in DevTools Network tab
- **Performance drops**: Profile in Three.js DevTools, check planet geometry segment counts (currently 32x32)

## NASA API Nuances
- Endpoint: `/api/TAP/sync?query=...` (proxied to exoplanetarchive.ipac.caltech.edu)
- CSV has header comments starting with `#` — must filter before parsing
- Missing fields default to `null` or are handled with fallback values (e.g., temperature → G-type star)
- Some systems may not have complete data (missing st_teff causes "Unknown" star type)
