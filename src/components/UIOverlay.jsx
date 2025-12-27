import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { fetchSystemData, toggleFavoriteSystem, getFavorites } from '../services/catalogService';

// Panels
import DiscoveryPanel from './panels/DiscoveryPanel';
import ControlsPanel from './panels/ControlsPanel';
import TimeControls from './panels/TimeControls';
import SystemHeader from './panels/SystemHeader';
import PlanetInfoCard from './PlanetInfoCard';
import PlanetList from './panels/PlanetList';
import ComparisonPanel from './panels/ComparisonPanel';
import Toolbar from './ui/Toolbar';

const UIOverlay = ({
    currentSystem,
    setCurrentSystem,
    selectedPlanet,
    setSelectedPlanet,
    selectedMoon,
    setSelectedMoon,
    systems,
    setSystems,
    useRealDistances,
    setUseRealDistances,
    timeSpeed,
    setTimeSpeed,
    showHabitableZone,
    setShowHabitableZone,
    isPaused,
    setIsPaused,
    timeDirection,
    setTimeDirection,
    stepFrame,
    setStepFrame,
    showOrbitLines,
    setShowOrbitLines,
    onOpenGalacticMap
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [favoritesList, setFavoritesList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);
    const [activePanel, setActivePanel] = useState(null);

    useEffect(() => {
        setFavoritesList(getFavorites());
    }, []);

    const handleSelectSystem = async (hostname) => {
        setIsLoading(true);
        try {
            // Check if system is already loaded (e.g., Solar System)
            let existingSystem = systems.find(s => s.name === hostname);
            if (existingSystem) {
                setCurrentSystem(existingSystem);
                setSelectedPlanet(null);
                setSelectedMoon(null);
                setIsLoading(false);
                return;
            }

            // Fetch new system if not already loaded
            const newSystem = await fetchSystemData(hostname);
            if (!systems.find(s => s.name === newSystem.name)) {
                setSystems(prev => [newSystem, ...prev]);
            }
            setCurrentSystem(newSystem);
            setSelectedPlanet(null);
            setSelectedMoon(null);
        } catch (error) {
            console.error('Failed to load system:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = () => {
        if (!currentSystem) return;
        const newFavs = toggleFavoriteSystem(currentSystem.name);
        setFavoritesList(newFavs);
    };

    const isCurrentSystemFavorite = currentSystem ? favoritesList.includes(currentSystem.name) : false;

    if (!currentSystem) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            padding: '20px',
            zIndex: 10
        }}>
            {/* Top Row - Toolbar and Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px'
            }}>
                {/* Left: Toolbar */}
                <Toolbar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    onOpenGalacticMap={onOpenGalacticMap}
                    currentSystemName={currentSystem?.name}
                    onGoHome={() => handleSelectSystem('Solar System')}
                />

                {/* Center: System Header */}
                <SystemHeader
                    currentSystem={currentSystem}
                    isFavorite={isCurrentSystemFavorite}
                    onToggleFavorite={handleToggleFavorite}
                />

                {/* Right: Spacer */}
                <div style={{ width: '180px' }} />
            </div>

            {/* Active Panel - appears below toolbar */}
            {activePanel && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: '20px',
                    maxHeight: 'calc(100vh - 180px)',
                    overflowY: 'auto',
                    pointerEvents: 'auto'
                }}>
                    {activePanel === 'discovery' && (
                        <DiscoveryPanel
                            onSelectSystem={handleSelectSystem}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                        />
                    )}
                    {activePanel === 'display' && (
                        <ControlsPanel
                            useRealDistances={useRealDistances}
                            setUseRealDistances={setUseRealDistances}
                            showHabitableZone={showHabitableZone}
                            setShowHabitableZone={setShowHabitableZone}
                            showOrbitLines={showOrbitLines}
                            setShowOrbitLines={setShowOrbitLines}
                            onOpenComparison={() => setShowComparison(true)}
                            onOpenGalacticMap={onOpenGalacticMap}
                            hideGalaxyMapButton={true}
                        />
                    )}
                    {activePanel === 'planets' && (
                        <PlanetList
                            planets={currentSystem.planets}
                            selectedPlanet={selectedPlanet}
                            onSelectPlanet={setSelectedPlanet}
                        />
                    )}
                </div>
            )}

            {/* Bottom Center: Time Controls */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto'
            }}>
                <TimeControls
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                    timeDirection={timeDirection}
                    setTimeDirection={setTimeDirection}
                    timeSpeed={timeSpeed}
                    setTimeSpeed={setTimeSpeed}
                    setStepFrame={setStepFrame}
                />
            </div>

            {/* Comparison Panel Modal */}
            <ComparisonPanel
                isOpen={showComparison}
                onClose={() => setShowComparison(false)}
                allPlanets={currentSystem.planets}
                initialPlanets={selectedPlanet ? [selectedPlanet] : []}
            />

            {/* Planet Info Card - appears on right when planet selected */}
            {selectedPlanet && (
                <PlanetInfoCard
                    planet={selectedPlanet}
                    selectedMoon={selectedMoon}
                    setSelectedMoon={setSelectedMoon}
                    onClose={() => setSelectedPlanet(null)}
                />
            )}
        </div>
    );
};

export default UIOverlay;
