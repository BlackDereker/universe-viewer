import { ChevronRight } from 'lucide-react';
import Panel from '../ui/Panel';

const PlanetList = ({
    planets,
    selectedPlanet,
    onSelectPlanet
}) => {
    if (!planets || planets.length === 0) return null;

    return (
        <Panel
            title={`Planets (${planets.length})`}
            icon={null}
            style={{ width: '100%' }}
            collapsible={false}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {planets.map((planet) => (
                    <button
                        key={planet.name}
                        onClick={() => onSelectPlanet(planet)}
                        style={{
                            width: '100%',
                            padding: '8px 10px',
                            background: selectedPlanet?.name === planet.name ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedPlanet?.name === planet.name ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)'}`,
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: '0.15s',
                            textAlign: 'left'
                        }}
                        onMouseOver={(e) => {
                            if (selectedPlanet?.name !== planet.name) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (selectedPlanet?.name !== planet.name) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            }
                        }}
                    >
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: planet.color,
                            boxShadow: `0 0 6px ${planet.color}`,
                            flexShrink: 0
                        }} />
                        <span style={{ fontSize: '12px', fontWeight: '500', flex: 1 }}>{planet.name}</span>
                        <ChevronRight size={12} style={{ opacity: 0.4 }} />
                    </button>
                ))}
            </div>
        </Panel>
    );
};

export default PlanetList;
