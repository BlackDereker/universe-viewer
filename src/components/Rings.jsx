import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import ringVertexShader from '../shaders/ringVertex.glsl?raw';
import ringFragmentShader from '../shaders/ringFragment.glsl?raw';

const Rings = ({ innerRadius, outerRadius, color = '#C5AB6E' }) => {
    const uniforms = useMemo(() => ({
        baseColor: { value: new THREE.Color(color) }
    }), [color]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <ringGeometry args={[innerRadius, outerRadius, 128]} />
            <shaderMaterial
                vertexShader={ringVertexShader}
                fragmentShader={ringFragmentShader}
                uniforms={uniforms}
                transparent={true}
                side={THREE.DoubleSide}
                depthWrite={true}
                depthTest={true}
            />
        </mesh>
    );
};

export default Rings;
