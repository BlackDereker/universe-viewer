import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, GodRays } from '@react-three/postprocessing';
import { BlendFunction, Resizer, KernelSize } from 'postprocessing';
import { useRef, Suspense, useState } from 'react';
import * as THREE from 'three';
import SolarSystem from './SolarSystem';
import CameraController from './CameraController';
import StarField from './StarField';
import TexturePreloader from './TexturePreloader';

const SpaceCanvas = ({ currentSystem, onPlanetSelect, selectedPlanet, selectedMoon, useRealDistances, timeSpeed, showHabitableZone, isPaused, timeDirection, stepFrame, showOrbitLines }) => {
    // Refs to track planet meshes for camera focus
    const planetRefs = useRef({});
    const moonRefs = useRef({});
    const sunRef = useRef();
    const [sunMesh, setSunMesh] = useState(null);

    // Calculate max distance based on orbit mode
    const maxOrbitDistance = Math.max(...currentSystem.planets.map(p => useRealDistances ? p.actualDistance : p.orderedDistance));

    // Allow zooming out far enough to see everything comfortably
    const maxCameraDistance = maxOrbitDistance * 4 + 200;

    // Stars skybox should be significantly larger to avoid clipping
    const skyboxRadius = 15000;

    return (
        <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}>
            <Canvas
                shadows
                gl={{
                    antialias: true,
                    logarithmicDepthBuffer: true,
                    alpha: false
                }}
                onPointerMissed={() => onPlanetSelect(null)}
            >
                <PerspectiveCamera makeDefault position={[0, 40, 60]} fov={60} far={100000} near={0.01} />
                <CameraController selectedPlanet={selectedPlanet} selectedMoon={selectedMoon} planetRefs={planetRefs} moonRefs={moonRefs} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    maxDistance={maxCameraDistance}
                    minDistance={selectedMoon ? selectedMoon.size * 2 : (selectedPlanet ? selectedPlanet.size * 2.5 : currentSystem.star.size * 0.8)}
                    makeDefault
                />

                <StarField currentSystem={currentSystem} />
                <ambientLight intensity={0.02} />
                <pointLight
                    position={[0, 0, 0]}
                    intensity={1.5}
                    color={currentSystem.star.color}
                    decay={0} // No decay so it reaches far planets consistently
                />

                <Suspense fallback={null}>
                    {/* Preload HD textures in the background */}
                    <TexturePreloader />
                    <SolarSystem
                        ref={setSunMesh}
                        system={currentSystem}
                        onPlanetSelect={onPlanetSelect}
                        selectedPlanet={selectedPlanet}
                        useRealDistances={useRealDistances}
                        timeSpeed={timeSpeed}
                        showHabitableZone={showHabitableZone}
                        planetRefs={planetRefs}
                        moonRefs={moonRefs}
                        isPaused={isPaused}
                        timeDirection={timeDirection}
                        stepFrame={stepFrame}
                        showOrbitLines={showOrbitLines}
                    />
                </Suspense>

                <EffectComposer multisampling={0}>
                    <Bloom
                        luminanceThreshold={1.1}
                        mipmapBlur
                        intensity={0.3}
                        radius={0.4}
                    />
                </EffectComposer>

                <color attach="background" args={['#050510']} />
            </Canvas>
        </div>
    );
};

export default SpaceCanvas;
