import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GalacticMap from './GalacticMap';
import { getAllSystemsForGalacticMap } from '../services/catalogService';

const GalacticMapCanvas = ({
    currentSystemName,
    onSelectSystem,
    onClose,
    searchTerm,
    onSystemsLoaded
}) => {
    const { t } = useTranslation();
    const [systems, setSystems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoveredSystem, setHoveredSystem] = useState(null);

    // Load all systems on mount
    useEffect(() => {
        const loadSystems = async () => {
            try {
                const allSystems = await getAllSystemsForGalacticMap();
                setSystems(allSystems);
                // Notify parent of loaded systems for dropdown search
                if (onSystemsLoaded) {
                    onSystemsLoaded(allSystems);
                }
            } catch (error) {
                console.error('Failed to load galactic map systems:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSystems();
    }, [onSystemsLoaded]);

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#030308'
        }}>
            {/* Loading overlay */}
            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    zIndex: 100,
                    background: '#030308'
                }}>
                    <div className="spinning" style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(255,255,255,0.1)',
                        borderTopColor: '#38bdf8',
                        borderRadius: '50%'
                    }} />
                    <p style={{ letterSpacing: '2px', fontSize: '12px', fontWeight: '600' }}>
                        {t('galacticMap.mappingGalaxy')}
                    </p>
                    <style>{`
                        .spinning { animation: spin 1s linear infinite; }
                        @keyframes spin { to { transform: rotate(360deg); } }
                    `}</style>
                </div>
            )}

            <Canvas
                gl={{
                    antialias: true,
                    alpha: false,
                    logarithmicDepthBuffer: true
                }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[0, 200, 400]}
                    fov={60}
                    far={10000}
                    near={0.1}
                />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    maxDistance={2000}
                    minDistance={20}
                    autoRotate
                    autoRotateSpeed={0.1}
                    makeDefault
                />

                {/* Background stars */}
                <Stars
                    radius={2000}
                    depth={100}
                    count={3000}
                    factor={4}
                    saturation={0.1}
                    fade
                    speed={0.5}
                />

                <ambientLight intensity={0.1} />

                <Suspense fallback={null}>
                    <GalacticMap
                        systems={systems}
                        currentSystemName={currentSystemName}
                        onSelectSystem={onSelectSystem}
                        searchTerm={searchTerm}
                        hoveredSystem={hoveredSystem}
                        setHoveredSystem={setHoveredSystem}
                    />
                </Suspense>

                <EffectComposer multisampling={0}>
                    <Bloom
                        luminanceThreshold={0.2}
                        mipmapBlur
                        intensity={0.8}
                        radius={0.6}
                    />
                </EffectComposer>

                {/* Fog for depth */}
                <fog attach="fog" args={['#030308', 500, 2000]} />

                <color attach="background" args={['#030308']} />
            </Canvas>

            {/* System count indicator */}
            {!isLoading && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '1px'
                }}>
                    {systems.length.toLocaleString()} {t('galacticMap.starSystems')}
                </div>
            )}

            {/* Hover info panel - outside canvas for proper positioning */}
            {hoveredSystem && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    right: '20px',
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    color: 'white',
                    fontFamily: 'Inter, sans-serif',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    minWidth: '200px',
                    zIndex: 100,
                    pointerEvents: 'none'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <span style={{
                            color: hoveredSystem.starColor,
                            fontSize: '24px',
                            textShadow: `0 0 12px ${hoveredSystem.starColor}`
                        }}>★</span>
                        <div>
                            <div style={{
                                fontWeight: 700,
                                fontSize: '16px',
                                letterSpacing: '0.5px'
                            }}>
                                {hoveredSystem.hostname}
                            </div>
                            <div style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '11px',
                                marginTop: '2px'
                            }}>
                                {hoveredSystem.starType}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t('galacticMap.planets')}</span>
                            <span style={{ fontWeight: 600 }}>
                                {hoveredSystem.planetCount}
                            </span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px'
                        }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t('galacticMap.distance')}</span>
                            <span style={{ fontWeight: 600 }}>
                                {hoveredSystem.distance.toFixed(1)} pc
                            </span>
                        </div>
                        {hoveredSystem.starTemp && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '12px'
                            }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t('galacticMap.starTemp')}</span>
                                <span style={{ fontWeight: 600 }}>
                                    {Math.round(hoveredSystem.starTemp).toLocaleString()} K
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.4)',
                        textAlign: 'center'
                    }}>
                        {t('galacticMap.clickToExplore')}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalacticMapCanvas;
