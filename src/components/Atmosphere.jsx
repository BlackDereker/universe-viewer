import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import atmosphereVertex from '../shaders/atmosphereVertex.glsl?raw';
import atmosphereFragment from '../shaders/atmosphereFragment.glsl?raw';

const Atmosphere = ({ radius, color = '#4488ff', strength = 1.5 }) => {
    const materialRef = useRef();

    const uniforms = useMemo(() => ({
        uLightPos: { value: new THREE.Vector3(0, 0, 0) },
        uAtmosphereColor: { value: new THREE.Color(color) },
        uAtmosphereStrength: { value: strength },
    }), [color, strength]);

    return (
        <mesh scale={[1.1, 1.1, 1.1]}>
            <sphereGeometry args={[radius, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={atmosphereVertex}
                fragmentShader={atmosphereFragment}
                uniforms={uniforms}
                transparent={true}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

export default Atmosphere;
