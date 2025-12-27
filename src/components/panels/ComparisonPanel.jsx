import { useState, useEffect } from 'react';
import { X, Plus, Scale, Flame, ArrowDown, Ruler, Clock, Orbit, Wind, Box } from 'lucide-react';
import { planetDetails } from '../../data/planetDetails';
import ScaleComparisonScene from './ScaleComparisonScene';
import AtmosphereVisualizer from '../ui/AtmosphereVisualizer';
import { estimateAtmosphere } from '../../utils/atmosphereUtils';

// Helper to get numeric value with fallback for exoplanets
const getNumericValue = (planet, key, fallback = null) => {
    const details = planetDetails[planet.name];
    if (details && details[key] !== undefined && details[key] !== null) {
        return details[key];
    }
    // For exoplanets, try to derive from planet data
    if (key === 'diameterKm' && planet.radius) {
        return planet.radius * 12742; // radius in Earth radii
    }
    return fallback;
};

// Animated bar that grows from 0 to target width
const AnimatedBar = ({ percentage, color }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth(Math.min(percentage, 100));
        }, 50);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div style={{
            width: `${width}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: '4px',
            transition: 'width 0.6s ease-out'
        }} />
    );
};

// Temperature bar with 0 in the middle
const TemperatureBar = ({ values, labels, colors, unit }) => {
    const [animatedWidths, setAnimatedWidths] = useState(values.map(() => 0));

    // Find the max absolute value to scale bars
    const maxAbsValue = Math.max(...values.filter(v => v !== null).map(v => Math.abs(v)), 1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedWidths(values.map(v => v !== null ? (Math.abs(v) / maxAbsValue) * 50 : 0));
        }, 50);
        return () => clearTimeout(timer);
    }, [values, maxAbsValue]);

    return (
        <div style={{ marginBottom: '16px' }}>
            {values.map((value, index) => {
                if (value === null) return null;
                const isNegative = value < 0;
                const barWidth = animatedWidths[index];

                return (
                    <div key={index} style={{ marginBottom: '8px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.7)'
                        }}>
                            <span style={{ color: colors[index], fontWeight: '600' }}>{labels[index]}</span>
                            <span>{value.toLocaleString()}{unit}</span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {/* Center dotted line at 0°C */}
                            <div style={{
                                position: 'absolute',
                                left: '50%',
                                top: 0,
                                bottom: 0,
                                width: '2px',
                                background: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 2px, transparent 2px, transparent 4px)',
                                transform: 'translateX(-50%)',
                                zIndex: 2
                            }} />
                            {/* Temperature bar */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                ...(isNegative ? {
                                    right: '50%',
                                    width: `${barWidth}%`,
                                    background: `linear-gradient(270deg, ${colors[index]}, ${colors[index]}88)`,
                                    borderRadius: '4px 0 0 4px'
                                } : {
                                    left: '50%',
                                    width: `${barWidth}%`,
                                    background: `linear-gradient(90deg, ${colors[index]}, ${colors[index]}88)`,
                                    borderRadius: '0 4px 4px 0'
                                }),
                                transition: 'width 0.6s ease-out'
                            }} />
                        </div>
                    </div>
                );
            })}
            {/* 0°C label below */}
            <div style={{
                textAlign: 'center',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.4)',
                marginTop: '4px'
            }}>
                0°C
            </div>
        </div>
    );
};

// Comparison bar component
const ComparisonBar = ({ values, labels, colors, unit, max }) => {
    const maxValue = max || Math.max(...values.filter(v => v !== null));

    return (
        <div style={{ marginBottom: '16px' }}>
            {values.map((value, index) => {
                if (value === null) return null;
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                return (
                    <div key={index} style={{ marginBottom: '8px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.7)'
                        }}>
                            <span style={{ color: colors[index], fontWeight: '600' }}>{labels[index]}</span>
                            <span>{typeof value === 'number' ? value.toLocaleString() : value}{unit}</span>
                        </div>
                        <div style={{
                            height: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <AnimatedBar percentage={percentage} color={colors[index]} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Planet slot component
const PlanetSlot = ({ planet, onRemove, onAdd, onShowAtmosphere, index, allPlanets, selectedPlanets }) => {
    const [showSelector, setShowSelector] = useState(false);

    if (!planet) {
        return (
            <div style={{ position: 'relative' }}>
                <button
                    onClick={() => setShowSelector(!showSelector)}
                    style={{
                        width: '100%',
                        height: '160px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '2px dashed rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.4)'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    }}
                >
                    <Plus size={24} />
                    <span style={{ fontSize: '11px' }}>Add Planet</span>
                </button>

                {/* Planet Selector Dropdown */}
                {showSelector && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: 'rgba(15, 15, 35, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 100,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                    }}>
                        {allPlanets
                            .filter(p => !selectedPlanets.find(sp => sp?.name === p.name))
                            .map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => {
                                        onAdd(p, index);
                                        setShowSelector(false);
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        textAlign: 'left'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: p.color || '#888',
                                        boxShadow: `0 0 6px ${p.color || '#888'}`
                                    }} />
                                    {p.name}
                                </button>
                            ))}
                    </div>
                )}
            </div>
        );
    }

    const details = planetDetails[planet.name];
    const diameterKm = getNumericValue(planet, 'diameterKm', 12742);

    // Calculate sphere size (relative to container, max 80px)
    const maxDiameter = 139820; // Jupiter
    const sphereSize = Math.max(12, (diameterKm / maxDiameter) * 80);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            position: 'relative',
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Remove button */}
            <button
                onClick={() => onRemove(index)}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)'
                }}
            >
                <X size={12} />
            </button>

            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '2px'
                }}>
                    {planet.name}
                </div>
                <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.5)'
                }}>
                    {details?.type || 'Exoplanet'}
                </div>
                <div style={{
                    fontSize: '11px',
                    color: planet.color || '#38bdf8',
                    marginTop: '4px'
                }}>
                    {diameterKm?.toLocaleString()} km
                </div>

                {estimateAtmosphere(planet, details) && (
                    <button
                        onClick={() => onShowAtmosphere(planet)}
                        style={{
                            marginTop: '8px',
                            padding: '4px 8px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            borderRadius: '4px',
                            color: '#38bdf8',
                            fontSize: '9px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                            e.currentTarget.style.borderColor = '#38bdf8';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                        }}
                    >
                        <Wind size={10} />
                        ATMOSPHERE
                    </button>
                )}
            </div>
        </div>
    );
};

// Stat row component
const StatRow = ({ icon: Icon, label, values, colors, unit = '' }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: `100px repeat(${values.length}, 1fr)`,
        gap: '8px',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        alignItems: 'center'
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)'
        }}>
            <Icon size={12} />
            {label}
        </div>
        {values.map((value, i) => (
            <div key={i} style={{
                fontSize: '12px',
                fontWeight: '600',
                color: colors[i],
                textAlign: 'center'
            }}>
                {value !== null && value !== undefined ?
                    (typeof value === 'number' ? value.toLocaleString() : value) + unit :
                    '—'}
            </div>
        ))}
    </div>
);

const ComparisonPanel = ({
    isOpen,
    onClose,
    allPlanets = [],
    initialPlanets = []
}) => {
    const [selectedPlanets, setSelectedPlanets] = useState(
        initialPlanets.length > 0 ? [...initialPlanets, null, null].slice(0, 3) : [null, null, null]
    );
    const [visualizerPlanet, setVisualizerPlanet] = useState(null);

    if (!isOpen) return null;

    const handleAddPlanet = (planet, index) => {
        const newSelected = [...selectedPlanets];
        newSelected[index] = planet;
        setSelectedPlanets(newSelected);
    };

    const handleRemovePlanet = (index) => {
        const newSelected = [...selectedPlanets];
        newSelected[index] = null;
        setSelectedPlanets(newSelected);
    };

    const activePlanets = selectedPlanets.filter(p => p !== null);
    const colors = ['#38bdf8', '#a855f7', '#22c55e'];

    // Get comparison values
    const getValues = (key, fallback = null) =>
        selectedPlanets.map(p => p ? getNumericValue(p, key, fallback) : null);

    const diameterValues = getValues('diameterKm');
    const massValues = getValues('massEarths');
    const gravityValues = getValues('gravityMs2');
    const tempValues = getValues('avgTempC');
    const distanceValues = getValues('distanceFromSunAU');
    const dayValues = getValues('dayLengthHours');
    const yearValues = getValues('yearLengthDays');

    const planetNames = selectedPlanets.map(p => p?.name || '');
    const planetColors = selectedPlanets.map((p, i) => p ? colors[i] : '#888');

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            pointerEvents: 'auto'
        }}>
            <div
                className="glass-morphism"
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: '16px',
                    padding: '20px'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Scale size={20} style={{ color: '#38bdf8' }} />
                        <h2 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            background: 'linear-gradient(135deg, #38bdf8, #a855f7)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Planet Comparison
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Planet Slots */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    {selectedPlanets.map((planet, index) => (
                        <PlanetSlot
                            key={index}
                            index={index}
                            planet={planet}
                            onRemove={handleRemovePlanet}
                            onAdd={handleAddPlanet}
                            onShowAtmosphere={setVisualizerPlanet}
                            allPlanets={allPlanets}
                            selectedPlanets={selectedPlanets}
                        />
                    ))}
                </div>

                {/* 3D Scale Comparison Lab */}
                <ScaleComparisonScene planets={selectedPlanets} />

                {/* Atmosphere Visualizer Overlay */}
                {visualizerPlanet && (
                    <AtmosphereVisualizer
                        planetName={visualizerPlanet.name}
                        composition={estimateAtmosphere(visualizerPlanet, planetDetails[visualizerPlanet.name])}
                        onClose={() => setVisualizerPlanet(null)}
                    />
                )}

                {/* Comparison Charts */}
                {activePlanets.length >= 2 && (
                    <>
                        {/* Size Comparison */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Ruler size={14} />
                                Diameter (km)
                            </h3>
                            <ComparisonBar
                                values={diameterValues.filter((_, i) => selectedPlanets[i])}
                                labels={planetNames.filter((_, i) => selectedPlanets[i])}
                                colors={planetColors.filter((_, i) => selectedPlanets[i])}
                                unit=" km"
                            />
                        </div>

                        {/* Mass Comparison */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Scale size={14} />
                                Mass (Earth = 1)
                            </h3>
                            <ComparisonBar
                                values={massValues.filter((_, i) => selectedPlanets[i])}
                                labels={planetNames.filter((_, i) => selectedPlanets[i])}
                                colors={planetColors.filter((_, i) => selectedPlanets[i])}
                                unit="×"
                            />
                        </div>

                        {/* Gravity Comparison */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <ArrowDown size={14} />
                                Surface Gravity (m/s²)
                            </h3>
                            <ComparisonBar
                                values={gravityValues.filter((_, i) => selectedPlanets[i])}
                                labels={planetNames.filter((_, i) => selectedPlanets[i])}
                                colors={planetColors.filter((_, i) => selectedPlanets[i])}
                                unit=" m/s²"
                            />
                        </div>

                        {/* Temperature Comparison */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <Flame size={14} />
                                Average Temperature
                            </h3>
                            <TemperatureBar
                                values={tempValues.filter((_, i) => selectedPlanets[i])}
                                labels={planetNames.filter((_, i) => selectedPlanets[i])}
                                colors={planetColors.filter((_, i) => selectedPlanets[i])}
                                unit="°C"
                            />
                        </div>

                        {/* Detailed Stats Table */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            padding: '16px',
                            marginTop: '24px'
                        }}>
                            <h3 style={{
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'rgba(255,255,255,0.5)',
                                marginBottom: '12px'
                            }}>
                                Detailed Comparison
                            </h3>

                            <StatRow
                                icon={Ruler}
                                label="Diameter"
                                values={diameterValues}
                                colors={planetColors}
                                unit=" km"
                            />
                            <StatRow
                                icon={Scale}
                                label="Mass"
                                values={massValues}
                                colors={planetColors}
                                unit="× Earth"
                            />
                            <StatRow
                                icon={ArrowDown}
                                label="Gravity"
                                values={gravityValues}
                                colors={planetColors}
                                unit=" m/s²"
                            />
                            <StatRow
                                icon={Flame}
                                label="Avg Temp"
                                values={tempValues}
                                colors={planetColors}
                                unit="°C"
                            />
                            <StatRow
                                icon={Orbit}
                                label="Distance"
                                values={distanceValues}
                                colors={planetColors}
                                unit=" AU"
                            />
                            <StatRow
                                icon={Clock}
                                label="Day Length"
                                values={dayValues}
                                colors={planetColors}
                                unit=" hrs"
                            />
                            <StatRow
                                icon={Orbit}
                                label="Year Length"
                                values={yearValues}
                                colors={planetColors}
                                unit=" days"
                            />
                        </div>
                    </>
                )}

                {activePlanets.length < 2 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: '13px'
                    }}>
                        <Scale size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                        <p>Select at least 2 planets to compare</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComparisonPanel;
