import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { X, Info } from 'lucide-react';

const GAS_COLORS = {
    N2: '#4a9eff',   // Deep blue
    O2: '#84ccff',   // Celestial blue
    Ar: '#ce93d8',   // Soft purple
    CO2: '#ff7675',  // Muted red
    SO2: '#ffee58',  // Yellow/Acid
    H2: '#f5f5f5',   // Light grey/White
    He: '#ffcc80',   // Soft orange
    CH4: '#55efc4',  // Green/Organic
    CO: '#bdbdbd',   // Grey
    N: '#74b9ff',    // Atomic Nitrogen
    O: '#81ecec',    // Atomic Oxygen
};

const GasParticles = ({ composition }) => {
    const pointsRef = useRef();
    const particleCount = 2000;

    // Create particles based on composition percentages
    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const gasEntries = Object.entries(composition);
        let currentIndex = 0;

        gasEntries.forEach(([gas, percentage]) => {
            const count = Math.round((percentage / 100) * particleCount);
            const color = new THREE.Color(GAS_COLORS[gas] || '#ffffff');

            for (let i = 0; i < count && currentIndex < particleCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = Math.pow(Math.random(), 0.5) * 4;

                positions[currentIndex * 3] = r * Math.sin(phi) * Math.cos(theta);
                positions[currentIndex * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[currentIndex * 3 + 2] = r * Math.cos(phi);

                colors[currentIndex * 3] = color.r;
                colors[currentIndex * 3 + 1] = color.g;
                colors[currentIndex * 3 + 2] = color.b;

                currentIndex++;
            }
        });

        return { positions, colors };
    }, [composition]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pointsRef.current) {
            pointsRef.current.rotation.y = time * 0.1;
            pointsRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
        }
    });

    return (
        <points ref={pointsRef} frustumCulled={false} renderOrder={2}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particles.colors.length / 3}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                depthTest={true}
            />
        </points>
    );
};

const AtmosphereVisualizer = ({ planetName, composition, onClose }) => {
    return (
        <div
            className="glass-morphism"
            onPointerDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(90vw, 500px)',
                height: '600px',
                borderRadius: '24px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                pointerEvents: 'auto'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                zIndex: 10
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', color: 'white' }}>{planetName}</h2>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Atmospheric Composition Breakdown</p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white'
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* 3D Visualizer Scene */}
            <div style={{ flex: 1, position: 'relative' }}>
                <Canvas alpha={true} gl={{ antialias: true }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} near={0.1} far={100} />
                    <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} minDistance={5} maxDistance={20} />
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />

                    <GasParticles composition={composition} />

                    {/* Laboratory Container Effect - Split into Back and Front for correct transparency */}
                    <mesh renderOrder={1}>
                        <sphereGeometry args={[4.5, 64, 64]} />
                        <meshPhysicalMaterial
                            color="#fff"
                            transparent
                            opacity={0.1}
                            roughness={0}
                            metalness={0.1}
                            transmission={0.5}
                            thickness={1}
                            side={THREE.BackSide}
                            depthWrite={false}
                        />
                    </mesh>

                    <mesh renderOrder={3}>
                        <sphereGeometry args={[4.5, 64, 64]} />
                        <meshPhysicalMaterial
                            color="#fff"
                            transparent
                            opacity={0.15}
                            roughness={0.1}
                            metalness={0.2}
                            transmission={0.9}
                            thickness={2}
                            side={THREE.FrontSide}
                            depthWrite={false}
                        />
                    </mesh>

                    <Stars radius={50} depth={50} count={1000} factor={2} saturation={0} fade speed={1} />
                </Canvas>

                {/* Legend Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}>
                    {Object.entries(composition).map(([gas, percentage]) => (
                        <div key={gas} style={{
                            padding: '6px 12px',
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            border: `1px solid ${GAS_COLORS[gas]}44`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '11px',
                            color: 'white'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: GAS_COLORS[gas] }} />
                            <span>{gas}</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Interaction Info */}
            <div style={{
                padding: '16px',
                textAlign: 'center',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.4)',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
            }}>
                <Info size={12} />
                DRAG TO ROTATE • SCROLL TO ZOOM • PARTICLES MATCH CHEMICAL COMPOSITION
            </div>
        </div>
    );
};

export default AtmosphereVisualizer;
