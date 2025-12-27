import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/godRayVertex.glsl?raw';
import fragmentShader from '../shaders/godRayFragment.glsl?raw';

const StarGodRays = ({ radius, color, isSun }) => {
    const meshRef = useRef();
    const materialRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uIsSun: { value: isSun ? 1.0 : 0.0 }
    }), [color, isSun]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
        if (meshRef.current) {
            // Slow rotation for dynamic rays
            meshRef.current.rotation.y += 0.0005;
            meshRef.current.rotation.z += 0.0003;
        }
    });

    return (
        <mesh ref={meshRef} scale={[2.5, 2.5, 2.5]} renderOrder={2}>
            <sphereGeometry args={[radius, 32, 32]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                depthTest={true}
            />
        </mesh>
    );
};

export default StarGodRays;
