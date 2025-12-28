import { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Planet from './Planet';
import HabitableZone from './HabitableZone';
import AsteroidBelt from './AsteroidBelt';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import starVertexShader from '../shaders/starVertex.glsl?raw';
import starFragmentShader from '../shaders/starFragment.glsl?raw';
import { getAssetPath } from '../utils/assetPath';
import { getSpectralType, getSpectralTypeIndex } from '../data/starTypes';

const StarMaterial = ({ texture, color, emissiveIntensity, isSun, temperature }) => {
    const map = useTexture(texture);
    const materialRef = useRef();

    const spectralType = getSpectralType(temperature);
    const typeIndex = getSpectralTypeIndex(temperature);

    const uniforms = useMemo(() => ({
        uMap: { value: map },
        uColor: { value: new THREE.Color(color) },
        uEmissiveIntensity: { value: emissiveIntensity },
        uIsSun: { value: isSun ? 1.0 : 0.0 },
        uTime: { value: 0 },
        uSurfaceActivity: { value: spectralType.surfaceActivity },
        uStarType: { value: typeIndex },
        uPulsationAmplitude: { value: spectralType.pulsationAmplitude },
        uPulsationPeriod: { value: spectralType.pulsationPeriod }
    }), [map, color, emissiveIntensity, isSun, spectralType, typeIndex]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={starVertexShader}
            fragmentShader={starFragmentShader}
            depthWrite={true}
            depthTest={true}
            transparent={false}
        />
    );
};

const SolarSystem = forwardRef(({ system, onPlanetSelect, selectedPlanet, useRealDistances, timeSpeed, showHabitableZone, planetRefs, moonRefs, isPaused, timeDirection, stepFrame, showOrbitLines }, ref) => {
    const sunRef = useRef();
    const isSun = system.id === 'solar-system';
    const lastStepFrame = useRef(stepFrame);

    useImperativeHandle(ref, () => sunRef.current);

    useFrame((state, delta) => {
        // Calculate effective delta (0 when paused, unless stepping)
        const isStepFrame = stepFrame !== lastStepFrame.current;
        lastStepFrame.current = stepFrame;
        const effectiveDelta = isPaused && !isStepFrame ? 0 : (isStepFrame ? 0.016 : delta);

        if (sunRef.current && effectiveDelta > 0) {
            sunRef.current.rotation.y += 0.002 * timeSpeed * timeDirection * effectiveDelta * 60;
        }
    });

    return (
        <group>
            {/* Habitable Zone Ring */}
            {showHabitableZone && (
                <HabitableZone
                    starTemp={system.star.temperature}
                    starSize={system.star.size}
                    useRealDistances={useRealDistances}
                    planets={system.planets}
                />
            )}

            {/* Central Star */}
            <group>
                <mesh ref={sunRef} renderOrder={0}>
                    <sphereGeometry args={[system.star.size, 64, 64]} />
                    <StarMaterial
                        key={`${system.id}-star`}
                        texture={system.star.texture || getAssetPath('textures/sun.png')}
                        color={system.star.color}
                        emissiveIntensity={system.star.emissiveIntensity}
                        isSun={isSun}
                        temperature={system.star.temperature}
                    />
                </mesh>
            </group>

            {/* Asteroid Belts */}
            {system.belts && system.belts.map((belt) => (
                <AsteroidBelt
                    key={belt.name}
                    innerRadius={useRealDistances ? belt.innerRadius : belt.orderedInner}
                    outerRadius={useRealDistances ? belt.outerRadius : belt.orderedOuter}
                    count={belt.count}
                    color={belt.color}
                    timeSpeed={timeSpeed}
                    useRealDistances={useRealDistances}
                    isPaused={isPaused}
                    timeDirection={timeDirection}
                    stepFrame={stepFrame}
                />
            ))}

            {/* Planets */}
            {system.planets.map((planet) => (
                <Planet
                    key={planet.name}
                    ref={(el) => {
                        if (planetRefs) planetRefs.current[planet.name] = el;
                    }}
                    planet={planet}
                    onSelect={onPlanetSelect}
                    isSelected={selectedPlanet?.name === planet.name}
                    useRealDistances={useRealDistances}
                    timeSpeed={timeSpeed}
                    moonRefs={moonRefs}
                    isPaused={isPaused}
                    timeDirection={timeDirection}
                    stepFrame={stepFrame}
                    showOrbitLines={showOrbitLines}
                />
            ))}
        </group>
    );
});

export default SolarSystem;
