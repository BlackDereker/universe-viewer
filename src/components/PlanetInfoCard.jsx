import { useState } from 'react';
import { X, ChevronDown, ChevronUp, ChevronRight, Globe, Thermometer, Wind, Mountain, Rocket, Sparkles, Box, Info } from 'lucide-react';
import { planetDetails } from '../data/planetDetails';
import AtmosphereVisualizer from './ui/AtmosphereVisualizer';
import { estimateAtmosphere, getAtmosphereDescription } from '../utils/atmosphereUtils';
import MissionTimeline from './ui/MissionTimeline';

const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.9)',
                    cursor: 'pointer',
                    padding: '4px 0',
                    fontSize: '12px',
                    fontWeight: '600'
                }}
            >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={14} style={{ color: '#38bdf8' }} />
                    {title}
                </span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {isOpen && (
                <div style={{ padding: '8px 0 4px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const AtmosphereBar = ({ composition }) => {
    const colors = {
        H2: '#ff6b6b',
        He: '#feca57',
        N2: '#48dbfb',
        O2: '#1dd1a1',
        CO2: '#ff9f43',
        Ar: '#a55eea',
        CH4: '#00d2d3',
        SO2: '#ffeaa7'
    };

    return (
        <div style={{ marginTop: '6px' }}>
            <div style={{ display: 'flex', borderRadius: '4px', overflow: 'hidden', height: '12px' }}>
                {Object.entries(composition).map(([gas, percentage]) => (
                    <div
                        key={gas}
                        style={{
                            width: `${percentage}%`,
                            backgroundColor: colors[gas] || '#888',
                            minWidth: percentage > 0.5 ? '2px' : '0'
                        }}
                        title={`${gas}: ${percentage}%`}
                    />
                ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {Object.entries(composition).map(([gas, percentage]) => (
                    <span key={gas} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '2px',
                            backgroundColor: colors[gas] || '#888'
                        }} />
                        {gas}: {percentage}%
                    </span>
                ))}
            </div>
        </div>
    );
};

const PlanetInfoCard = ({ planet, selectedMoon, setSelectedMoon, onClose }) => {
    const [showVisualizer, setShowVisualizer] = useState(false);
    if (!planet) return null;

    const object = selectedMoon || planet;
    const isMoon = !!selectedMoon;
    const details = planetDetails[object.name];
    const estimatedAtm = estimateAtmosphere(object, details);
    const atmDesc = getAtmosphereDescription(object, details);

    return (
        <>
            <div className="glass-morphism" style={{
                position: 'fixed',
                top: '80px',
                right: '20px',
                width: '340px',
                maxHeight: 'calc(100vh - 160px)',
                overflowY: 'auto',
                borderRadius: '12px',
                padding: '16px',
                zIndex: 100,
                pointerEvents: 'auto',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: 'white' }}>{object.name}</h3>
                        <span style={{
                            display: 'inline-block',
                            marginTop: '4px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: '600',
                            background: isMoon ? 'rgba(255, 255, 255, 0.1)' : 'rgba(56, 189, 248, 0.2)',
                            color: isMoon ? 'rgba(255,255,255,0.7)' : '#38bdf8'
                        }}>
                            {isMoon ? `Moon of ${planet.name}` : (details?.type || (planet.planetType === 'gas' ? 'Gas Giant' : planet.planetType === 'super-earth' ? 'Super-Earth' : 'Rocky Planet'))}
                        </span>
                    </div>
                    <button onClick={() => isMoon ? setSelectedMoon(null) : onClose()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}>
                        <X size={18} />
                    </button>
                </div>

                {!details && (
                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>
                        {object.description || (isMoon ? `A lunar body orbiting ${planet.name}.` : 'An exoplanet discovered beyond our solar system.')}
                    </p>
                )}

                {/* Quick Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '8px',
                    marginBottom: '12px'
                }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Diameter</div>
                        <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>
                            {details?.diameter || (object.size ? `${(object.size * 84946).toLocaleString()} km` : 'Unknown')}
                        </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Type</div>
                        <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{details?.type || (planet.planetType || 'Rocky')}</div>
                    </div>
                    {details ? (
                        <>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Day Length</div>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{details.dayLength}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Year Length</div>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{details.yearLength || 'N/A'}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Temperature</div>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{Math.round(planet.temperature - 273.15)}°C</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Distance</div>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: '600' }}>{object.actualDistance ? `${(object.actualDistance / 50).toFixed(2)} AU` : 'N/A'}</div>
                            </div>
                        </>
                    )}
                </div>

                {/* Temperature */}
                {details?.avgTemperature && (
                    <Section title="Temperature" icon={Thermometer} defaultOpen={true}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#ff9f43' }}>
                                {details.avgTemperature}
                            </span>
                        </div>
                    </Section>
                )}

                {/* Atmosphere */}
                <Section title="Atmosphere" icon={Wind} defaultOpen={!!estimatedAtm}>
                    <p style={{ margin: '0 0 8px 0' }}>{atmDesc}</p>
                    {estimatedAtm && (
                        <>
                            <AtmosphereBar composition={estimatedAtm} />
                            <button
                                onClick={() => setShowVisualizer(true)}
                                style={{
                                    width: '100%',
                                    marginTop: '12px',
                                    padding: '10px',
                                    background: 'rgba(56, 189, 248, 0.15)',
                                    border: '1px solid rgba(56, 189, 248, 0.4)',
                                    borderRadius: '8px',
                                    color: '#38bdf8',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.1)'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(56, 189, 248, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 189, 248, 0.1)';
                                }}
                            >
                                <Sparkles size={14} />
                                VIEW FULL BREAKDOWN
                            </button>
                            {!details && (
                                <div style={{
                                    marginTop: '8px',
                                    fontSize: '9px',
                                    color: 'rgba(255,255,255,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Info size={10} />
                                    Data estimated for this exoplanet
                                </div>
                            )}
                        </>
                    )}
                </Section>

                {/* Surface Features */}
                {details?.surfaceFeatures && (
                    <Section title="Surface Features" icon={Mountain}>
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {details.surfaceFeatures.map((feature, i) => (
                                <li key={i} style={{ marginBottom: '2px' }}>{feature}</li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Fun Facts */}
                {details?.funFacts && (
                    <Section title="Fun Facts" icon={Sparkles}>
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                            {details.funFacts.map((fact, i) => (
                                <li key={i} style={{ marginBottom: '4px' }}>{fact}</li>
                            ))}
                        </ul>
                    </Section>
                )}

                {/* Missions */}
                {details?.missions && (
                    <Section title="Exploration Timeline" icon={Rocket} defaultOpen={true}>
                        <MissionTimeline missions={details.missions} />
                    </Section>
                )}

                {/* Discovery */}
                {(details?.discoveredBy || planet.discoveryYear) && (
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.5)'
                    }}>
                        <strong>Discovered:</strong> {details?.discoveredBy || object.discoveryYear || 'Ancient times'}
                    </div>
                )}

                {/* Moons List */}
                {!isMoon && planet.moons && planet.moons.length > 0 && (
                    <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Moons ({planet.moons.length})
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '6px' }}>
                            {planet.moons.map((moon, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedMoon(moon)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'left'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                >
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: moon.color || '#fff' }} />
                                    <span style={{ flex: 1 }}>{moon.name}</span>
                                    <ChevronRight size={12} style={{ opacity: 0.3 }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Atmosphere Visualizer Overlay - Rendered as a separate layer outside the card */}
            {showVisualizer && estimatedAtm && (
                <AtmosphereVisualizer
                    planetName={object.name}
                    composition={estimatedAtm}
                    onClose={() => setShowVisualizer(false)}
                />
            )}
        </>
    );
};

export default PlanetInfoCard;
