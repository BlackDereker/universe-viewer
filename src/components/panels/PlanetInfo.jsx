import { useState } from 'react';
import { X, ChevronRight, ChevronDown, ChevronUp, Thermometer, Wind, Mountain, Rocket, Sparkles } from 'lucide-react';
import { planetDetails } from '../../data/planetDetails';

const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '8px', paddingTop: '8px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.85)',
                    cursor: 'pointer',
                    padding: '2px 0',
                    fontSize: '11px',
                    fontWeight: '600'
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={12} style={{ color: '#38bdf8' }} />
                    {title}
                </span>
                {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {isOpen && (
                <div style={{ padding: '6px 0 2px 18px', fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const AtmosphereBar = ({ composition }) => {
    const colors = {
        H2: '#ff6b6b', He: '#feca57', N2: '#48dbfb', O2: '#1dd1a1',
        CO2: '#ff9f43', Ar: '#a55eea', CH4: '#00d2d3', SO2: '#ffeaa7'
    };

    return (
        <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', borderRadius: '3px', overflow: 'hidden', height: '8px' }}>
                {Object.entries(composition).map(([gas, percentage]) => (
                    <div
                        key={gas}
                        style={{ width: `${percentage}%`, backgroundColor: colors[gas] || '#888', minWidth: percentage > 0.5 ? '2px' : '0' }}
                        title={`${gas}: ${percentage}%`}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {Object.entries(composition).map(([gas, percentage]) => (
                    <span key={gas} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '2px', backgroundColor: colors[gas] || '#888' }} />
                        {gas}: {percentage}%
                    </span>
                ))}
            </div>
        </div>
    );
};

const PlanetInfo = ({
    selectedPlanet,
    selectedMoon,
    setSelectedPlanet,
    setSelectedMoon,
    currentSystem
}) => {
    const object = selectedMoon || selectedPlanet;
    const isMoon = !!selectedMoon;
    const details = planetDetails[object?.name];

    if (!object) return null;

    return (
        <div
            className="glass-morphism"
            style={{
                width: '280px',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                borderRadius: '16px',
                pointerEvents: 'auto',
                animation: 'slideIn 0.3s ease'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: object.color || '#888',
                    boxShadow: `0 0 8px ${object.color || '#888'}`,
                    flexShrink: 0
                }} />
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '1px' }}>{object.name}</h3>
                    <p style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>
                        {isMoon ? `Moon of ${selectedPlanet.name}` : (details?.type || object.planetType || 'Planet')}
                    </p>
                </div>
                <button
                    onClick={() => isMoon ? setSelectedMoon(null) : setSelectedPlanet(null)}
                    style={{
                        width: '24px', height: '24px', background: 'rgba(255,255,255,0.05)',
                        border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <X size={12} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: '12px 14px' }}>
                {/* Quick Stats Grid */}
                {details && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Diameter</div>
                            <div style={{ fontSize: '10px', fontWeight: '600' }}>{details.diameter}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Gravity</div>
                            <div style={{ fontSize: '10px', fontWeight: '600' }}>{details.gravity}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Day</div>
                            <div style={{ fontSize: '10px', fontWeight: '600' }}>{details.dayLength}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '6px', padding: '6px 8px' }}>
                            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Year</div>
                            <div style={{ fontSize: '10px', fontWeight: '600' }}>{details.yearLength || 'N/A'}</div>
                        </div>
                    </div>
                )}

                {/* Basic Stats (for planets without detailed data) */}
                {!isMoon && selectedPlanet && !details && (
                    <>
                        <StatRow label="Radius" value={`${selectedPlanet.radiusEarth?.toFixed(2) || '?'} Earth radii`} />
                        <StatRow label="Orbital Period" value={`${selectedPlanet.orbitalPeriod?.toFixed(1) || '?'} days`} />
                        {selectedPlanet.temperature && (
                            <StatRow label="Temperature" value={`${Math.round(selectedPlanet.temperature)}°C`} />
                        )}
                    </>
                )}

                {/* Habitable Zone Badge */}
                {selectedPlanet?.inHabitableZone && (
                    <div style={{
                        padding: '6px 8px', background: 'rgba(34, 255, 136, 0.1)',
                        border: '1px solid rgba(34, 255, 136, 0.3)', borderRadius: '6px',
                        fontSize: '10px', color: '#22ff88', marginBottom: '8px'
                    }}>
                        🌱 In Habitable Zone
                    </div>
                )}

                {/* Detailed Sections */}
                {details && (
                    <>
                        <Section title="Temperature" icon={Thermometer} defaultOpen={true}>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#ff9f43' }}>
                                {details.avgTemperature}
                            </span>
                        </Section>

                        <Section title="Atmosphere" icon={Wind}>
                            <p style={{ margin: '0 0 6px 0' }}>{details.atmosphereDesc}</p>
                            {details.atmosphere && <AtmosphereBar composition={details.atmosphere} />}
                        </Section>

                        <Section title="Surface" icon={Mountain}>
                            <ul style={{ margin: 0, paddingLeft: '14px' }}>
                                {details.surfaceFeatures.map((f, i) => <li key={i} style={{ marginBottom: '2px' }}>{f}</li>)}
                            </ul>
                        </Section>

                        <Section title="Fun Facts" icon={Sparkles}>
                            <ul style={{ margin: 0, paddingLeft: '14px' }}>
                                {details.funFacts.map((f, i) => <li key={i} style={{ marginBottom: '3px' }}>{f}</li>)}
                            </ul>
                        </Section>

                        <Section title="Missions" icon={Rocket}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                                {details.missions.map((m, i) => (
                                    <span key={i} style={{
                                        padding: '2px 6px', borderRadius: '3px',
                                        background: 'rgba(255,255,255,0.08)', fontSize: '9px'
                                    }}>{m}</span>
                                ))}
                            </div>
                        </Section>

                        {details.discoveredBy && (
                            <div style={{ marginTop: '8px', fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
                                <strong>Discovered:</strong> {details.discoveredBy}
                            </div>
                        )}
                    </>
                )}

                {/* Moons list */}
                {!isMoon && selectedPlanet?.moons?.length > 0 && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                        <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '600' }}>
                            MOONS ({selectedPlanet.moons.length})
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {selectedPlanet.moons.slice(0, 8).map((moon, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedMoon(moon)}
                                    style={{
                                        padding: '6px 8px',
                                        background: selectedMoon?.name === moon.name ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${selectedMoon?.name === moon.name ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)'}`,
                                        borderRadius: '5px', color: 'white', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px'
                                    }}
                                >
                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: moon.color || '#888' }} />
                                    <span style={{ flex: 1, textAlign: 'left' }}>{moon.name}</span>
                                    <ChevronRight size={10} style={{ opacity: 0.5 }} />
                                </button>
                            ))}
                            {selectedPlanet.moons.length > 8 && (
                                <span style={{ fontSize: '9px', color: 'var(--text-secondary)', textAlign: 'center', padding: '4px' }}>
                                    +{selectedPlanet.moons.length - 8} more moons
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

const StatRow = ({ label, value }) => (
    <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: '10px', fontWeight: '500' }}>{value}</span>
    </div>
);

export default PlanetInfo;
