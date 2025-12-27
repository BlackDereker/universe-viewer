import { Settings, Scale, Map } from 'lucide-react';
import Panel from '../ui/Panel';
import Toggle from '../ui/Toggle';

const ControlsPanel = ({
    useRealDistances,
    setUseRealDistances,
    showHabitableZone,
    setShowHabitableZone,
    showOrbitLines,
    setShowOrbitLines,
    onOpenComparison,
    onOpenGalacticMap,
    hideGalaxyMapButton = false
}) => {
    return (
        <Panel title="Display" icon={Settings} style={{ width: '100%' }} collapsible={false}>
            <Toggle
                label={useRealDistances ? 'Real Distances' : 'Compact View'}
                description="Toggle between compact and real orbital distances"
                value={useRealDistances}
                onChange={setUseRealDistances}
                color="var(--accent-blue)"
                size="compact"
            />

            <Toggle
                label="Habitable Zone"
                description="Show the Goldilocks zone where liquid water could exist"
                value={showHabitableZone}
                onChange={setShowHabitableZone}
                color="#22ff88"
                size="compact"
            />

            <Toggle
                label="Orbit Lines"
                description="Show circular orbital paths"
                value={showOrbitLines}
                onChange={setShowOrbitLines}
                color="#a855f7"
                size="compact"
            />

            {/* Compare Planets Button */}
            <button
                onClick={onOpenComparison}
                style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: '0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25))';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                }}
            >
                <Scale size={14} />
                Compare Planets
            </button>

            {/* Galaxy Map Button */}
            {!hideGalaxyMapButton && (
                <button
                    onClick={onOpenGalacticMap}
                    style={{
                        width: '100%',
                        marginTop: '8px',
                        padding: '10px 12px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: '0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(16, 185, 129, 0.25))';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))';
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                    }}
                >
                    <Map size={14} />
                    Galaxy Map
                </button>
            )}
        </Panel>
    );
};

export default ControlsPanel;

