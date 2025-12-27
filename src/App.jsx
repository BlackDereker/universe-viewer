import { useState, useEffect } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import UIOverlay from './components/UIOverlay';
import Credits from './components/Credits';
import GalacticMapCanvas from './components/GalacticMapCanvas';
import GalacticMapPanel from './components/panels/GalacticMapPanel';
import { getInitialSystems, loadAdditionalSystems, fetchSystemData } from './services/catalogService';

function App() {
  const [systems, setSystems] = useState([]);
  const [currentSystem, setCurrentSystem] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedMoon, setSelectedMoon] = useState(null);
  const [useRealDistances, setUseRealDistances] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showHabitableZone, setShowHabitableZone] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [timeDirection, setTimeDirection] = useState(1); // 1 = forward, -1 = rewind
  const [stepFrame, setStepFrame] = useState(0); // Increment to trigger single frame advance
  const [showOrbitLines, setShowOrbitLines] = useState(true); // Toggle orbit path lines
  const [showGalacticMap, setShowGalacticMap] = useState(false); // Galaxy view mode
  const [galacticSearchTerm, setGalacticSearchTerm] = useState(''); // Search in galaxy view
  const [galacticSystems, setGalacticSystems] = useState([]); // All systems for galactic map search

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Solar System immediately (it's hardcoded, very fast)
        const initial = await getInitialSystems();
        setSystems(initial);
        if (initial.length > 0) {
          setCurrentSystem(initial[0]);
        }
        setIsLoading(false);

        // Load additional systems in background after a short delay
        setTimeout(() => {
          loadAdditionalSystems((newSystem) => {
            setSystems(prev => [...prev, newSystem]);
          });
        }, 1000); // Wait 1 second before fetching exoplanet data

      } catch (error) {
        console.error('Failed to load initial systems:', error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        color: 'white',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div className="spinning" style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%' }} />
        <p style={{ letterSpacing: '2px', fontSize: '12px', fontWeight: '600' }}>INITIALIZING UNIVERSE...</p>
        <style>{`
          .spinning { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Handle selecting a system from the galactic map
  const handleGalacticSystemSelect = async (hostname) => {
    try {
      // Check if already loaded
      let system = systems.find(s => s.name === hostname);
      if (!system) {
        system = await fetchSystemData(hostname);
        setSystems(prev => [system, ...prev]);
      }
      setCurrentSystem(system);
      setSelectedPlanet(null);
      setSelectedMoon(null);
      setShowGalacticMap(false);
      setGalacticSearchTerm('');
    } catch (error) {
      console.error('Failed to load system from galactic map:', error);
    }
  };

  return (
    <div className="app-container" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Galactic Map View */}
      {showGalacticMap && (
        <>
          <GalacticMapCanvas
            currentSystemName={currentSystem?.name}
            onSelectSystem={handleGalacticSystemSelect}
            onClose={() => setShowGalacticMap(false)}
            searchTerm={galacticSearchTerm}
            onSystemsLoaded={setGalacticSystems}
          />
          <GalacticMapPanel
            onClose={() => setShowGalacticMap(false)}
            searchTerm={galacticSearchTerm}
            setSearchTerm={setGalacticSearchTerm}
            currentSystemName={currentSystem?.name}
            onSelectSystem={handleGalacticSystemSelect}
            systems={galacticSystems}
          />
        </>
      )}

      {/* System View */}
      {!showGalacticMap && currentSystem && (
        <SpaceCanvas
          currentSystem={currentSystem}
          onPlanetSelect={(planet) => {
            setSelectedPlanet(planet);
            setSelectedMoon(null);
          }}
          selectedPlanet={selectedPlanet}
          selectedMoon={selectedMoon}
          useRealDistances={useRealDistances}
          timeSpeed={timeSpeed}
          showHabitableZone={showHabitableZone}
          isPaused={isPaused}
          timeDirection={timeDirection}
          stepFrame={stepFrame}
          showOrbitLines={showOrbitLines}
        />
      )}

      {/* UI Overlay (only in system view) */}
      {!showGalacticMap && (
        <UIOverlay
          currentSystem={currentSystem}
          setCurrentSystem={setCurrentSystem}
          selectedPlanet={selectedPlanet}
          setSelectedPlanet={(planet) => {
            setSelectedPlanet(planet);
            setSelectedMoon(null);
          }}
          selectedMoon={selectedMoon}
          setSelectedMoon={setSelectedMoon}
          systems={systems}
          setSystems={setSystems}
          useRealDistances={useRealDistances}
          setUseRealDistances={setUseRealDistances}
          timeSpeed={timeSpeed}
          setTimeSpeed={setTimeSpeed}
          showHabitableZone={showHabitableZone}
          setShowHabitableZone={setShowHabitableZone}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          timeDirection={timeDirection}
          setTimeDirection={setTimeDirection}
          stepFrame={stepFrame}
          setStepFrame={setStepFrame}
          showOrbitLines={showOrbitLines}
          setShowOrbitLines={setShowOrbitLines}
          onOpenGalacticMap={() => setShowGalacticMap(true)}
        />
      )}
      {!showGalacticMap && <Credits />}
    </div>
  );
}

export default App;
