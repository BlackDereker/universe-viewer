import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment, ContactShadows, Html } from '@react-three/drei';
import ComparisonPlanet from './ComparisonPlanet';

const ScaleComparisonScene = ({ planets }) => {
    // Filter out nulls
    const activePlanets = useMemo(() => planets.filter(p => p !== null), [planets]);

    // Calculate dynamic spacing based on planet sizes
    const planetPositions = useMemo(() => {
        if (activePlanets.length === 0) return [];
        if (activePlanets.length === 1) return [0];

        const xPositions = [];
        const padding = 1.5;
        let totalWidth = 0;

        // Calculate total width needed
        activePlanets.forEach((p, i) => {
            totalWidth += p.size * 2;
            if (i < activePlanets.length - 1) totalWidth += padding;
        });

        let currentX = -totalWidth / 2;
        activePlanets.forEach((p, i) => {
            const centerX = currentX + p.size;
            xPositions.push(centerX);
            currentX += (p.size * 2) + padding;
        });

        return xPositions;
    }, [activePlanets]);

    return (
        <div style={{
            width: '100%',
            height: '280px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '20px',
            cursor: 'grab',
            position: 'relative'
        }}>
            <Canvas shadow={{ type: 'basic' }}>
                <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={35} />
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={40}
                />

                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} />

                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
                    <Environment preset="night" />

                    <group>
                        {activePlanets.map((planet, idx) => (
                            <group key={`${planet.name}-${idx}`} position={[planetPositions[idx] || 0, 0, 0]}>
                                <ComparisonPlanet planet={planet} />

                                {/* 3D Label */}
                                <Html
                                    position={[0, planet.size + 1.2, 0]}
                                    center
                                    distanceFactor={15}
                                    zIndexRange={[0, 10]}
                                >
                                    <div style={{
                                        color: planet.color || 'white',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        textShadow: '0 0 10px rgba(0,0,0,0.8)',
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none'
                                    }}>
                                        {planet.name}
                                    </div>
                                </Html>
                            </group>
                        ))}
                    </group>

                    <ContactShadows
                        position={[0, -2.5, 0]}
                        opacity={0.4}
                        scale={30}
                        blur={2.5}
                        far={4}
                    />
                </Suspense>
            </Canvas>

            {/* Visual indicator for interactivity */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '4px',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                pointerEvents: 'none'
            }}>
                3D SCALE VIEW - DRAG TO ROTATE
            </div>
        </div>
    );
};

export default ScaleComparisonScene;
