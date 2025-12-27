import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/planetVertex.glsl?raw';
import fragmentShader from '../shaders/planetFragment.glsl?raw';

const ProceduralPlanetMaterial = ({ planet }) => {
    const materialRef = useRef();

    const typeInt = useMemo(() => {
        if (planet.planetType === 'gas') return 2;
        if (planet.planetType === 'super-earth') return 1;
        return 0; // rocky
    }, [planet.planetType]);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSeed: { value: planet.seed || Math.random() },
        uBaseColor: { value: new THREE.Color(planet.color) },
        uTemperature: { value: planet.temperature || 300 },
        uPlanetType: { value: typeInt }
    }), [planet.seed, planet.color, planet.temperature, typeInt]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            depthWrite={true}
            depthTest={true}
            transparent={false}
        />
    );
};

export default ProceduralPlanetMaterial;
