import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/sunCoronaVertex.glsl?raw';
import fragmentShader from '../shaders/sunCoronaFragment.glsl?raw';

const SunCorona = ({ radius, color, isSun }) => {
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
            meshRef.current.rotation.z += 0.001;
            meshRef.current.rotation.x += 0.0005;
        }
    });

    return (
        <mesh ref={meshRef} scale={[1.2, 1.2, 1.2]} renderOrder={1}>
            <sphereGeometry args={[radius, 64, 64]} />
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

export default SunCorona;
