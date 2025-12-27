import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Rings from './Rings';
import Moon from './Moon';
import ProceduralPlanetMaterial from './ProceduralPlanetMaterial';
import EarthMaterial from './EarthMaterial';

const TexturedMaterial = ({ texture, ...props }) => {
    const map = useTexture(texture);
    return <meshStandardMaterial map={map} depthWrite={true} depthTest={true} transparent={false} {...props} />;
};

const Planet = forwardRef(({ planet, onSelect, isSelected, useRealDistances, timeSpeed, moonRefs, isPaused, timeDirection, stepFrame, showOrbitLines }, ref) => {
    const meshRef = useRef();
    const orbitRef = useRef();
    const [hovered, setHovered] = useState(false);
    const angle = useRef(Math.random() * Math.PI * 2); // Start at random position
    const currentDistance = useRef(useRealDistances ? planet.actualDistance : planet.orderedDistance);
    const lastStepFrame = useRef(stepFrame);

    const shouldHighlight = hovered && !isSelected;
    const isEarth = planet.name === 'Earth';

    // Expose the mesh ref to parent
    useImperativeHandle(ref, () => meshRef.current);

    // Simple orbital rotation
    useFrame((state, delta) => {
        // Calculate effective delta (0 when paused, unless stepping)
        const isStepFrame = stepFrame !== lastStepFrame.current;
        lastStepFrame.current = stepFrame;
        const effectiveDelta = isPaused && !isStepFrame ? 0 : (isStepFrame ? 0.016 : delta);

        // Increment angle based on planet speed, timeSpeed, direction and delta
        angle.current += effectiveDelta * planet.speed * timeSpeed * timeDirection * 100;

        // Smoothly interpolate between compact and real distances
        const targetDistance = useRealDistances ? planet.actualDistance : planet.orderedDistance;
        currentDistance.current += (targetDistance - currentDistance.current) * 0.05;

        // Calculate orbital position
        const x = Math.cos(angle.current) * currentDistance.current;
        const z = Math.sin(angle.current) * currentDistance.current;

        if (meshRef.current) {
            // Update orbital position
            meshRef.current.position.set(x, 0, z);
            // Self rotation (tidally locked would be much slower)
            meshRef.current.rotation.y += 0.02 * timeSpeed * timeDirection * effectiveDelta * 60;
        }

        // Update orbit ring scale (orbit ring is at origin, not moving with planet)
        if (orbitRef.current) {
            orbitRef.current.scale.set(currentDistance.current, currentDistance.current, 1);
        }
    });

    return (
        <>
            {/* Orbital Path - stays at origin (sun center) */}
            {showOrbitLines && (
                <mesh ref={orbitRef} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.995, 1.005, 128]} />
                    <meshBasicMaterial color="white" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Planet Group - moves in orbit */}
            <group ref={meshRef}>

                {/* Axial Tilt Group - tilts planet, atmosphere, and rings together */}
                <group rotation={[planet.axialTilt || 0, 0, 0]}>
                    {/* Planet Mesh */}
                    <mesh
                        renderOrder={2}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(planet);
                        }}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                    >
                        <sphereGeometry args={[planet.size, 32, 32]} />
                        {isEarth ? (
                            <EarthMaterial isSelected={isSelected} />
                        ) : planet.isProcedural ? (
                            <ProceduralPlanetMaterial planet={planet} />
                        ) : planet.texture ? (
                            <TexturedMaterial
                                texture={isSelected && planet.textureHD ? planet.textureHD : planet.texture}
                                color="white"
                                emissive={shouldHighlight ? planet.color : 'black'}
                                emissiveIntensity={shouldHighlight ? 0.3 : 0}
                            />
                        ) : (
                            <meshStandardMaterial
                                color={planet.color}
                                emissive={shouldHighlight ? planet.color : 'black'}
                                emissiveIntensity={shouldHighlight ? 0.5 : 0}
                                depthWrite={true}
                                depthTest={true}
                                transparent={false}
                            />
                        )}
                    </mesh>

                    {/* Planetary Rings */}
                    {planet.rings && (
                        <Rings
                            innerRadius={planet.size * planet.rings.inner}
                            outerRadius={planet.size * planet.rings.outer}
                            color={planet.rings.color || planet.color}
                        />
                    )}
                </group>

                {/* Moons */}
                {planet.moons && planet.moons.map((moon, idx) => (
                    <Moon
                        key={`${planet.name}-moon-${idx}`}
                        moon={moon}
                        timeSpeed={timeSpeed}
                        isPaused={isPaused}
                        timeDirection={timeDirection}
                        stepFrame={stepFrame}
                        showOrbitLines={showOrbitLines}
                        isParentSelected={isSelected}
                        ref={(el) => {
                            if (moonRefs) moonRefs.current[moon.name] = el;
                        }}
                    />
                ))}

                {/* Distance Marker (Visible when far) */}
                <points>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            count={1}
                            array={new Float32Array([0, 0, 0])}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={2}
                        sizeAttenuation={false}
                        color={planet.color}
                        transparent
                        opacity={0.5}
                    />
                </points>

                {/* Label on Hover */}
                {shouldHighlight && (
                    <Html distanceFactor={15} position={[0, planet.size + 0.5, 0]}>
                        <div className="planet-label" style={{
                            background: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            whiteSpace: 'nowrap',
                            border: `1px solid ${planet.color}`
                        }}>
                            {planet.name}
                        </div>
                    </Html>
                )}
            </group>
        </>
    );
});

export default Planet;
