import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Textured material for moons with textures
const TexturedMoonMaterial = ({ texture }) => {
    const map = useTexture(texture);
    return <meshStandardMaterial map={map} depthWrite={true} depthTest={true} />;
};

const Moon = forwardRef(({ moon, timeSpeed, isPaused, timeDirection, stepFrame, showOrbitLines, isParentSelected }, ref) => {
    const meshRef = useRef();
    const orbitRef = useRef();
    const angle = useRef(Math.random() * Math.PI * 2);
    const lastStepFrame = useRef(stepFrame);

    // Expose the mesh ref to parent
    useImperativeHandle(ref, () => meshRef.current);

    useFrame((state, delta) => {
        // Calculate effective delta (0 when paused, unless stepping)
        const isStepFrame = stepFrame !== lastStepFrame.current;
        lastStepFrame.current = stepFrame;
        const effectiveDelta = isPaused && !isStepFrame ? 0 : (isStepFrame ? 0.016 : delta);

        // Increment angle based on moon speed, timeSpeed, direction and delta
        angle.current += effectiveDelta * moon.speed * timeSpeed * timeDirection * 100;

        const x = Math.cos(angle.current) * moon.distance;
        const z = Math.sin(angle.current) * moon.distance;

        if (meshRef.current) {
            meshRef.current.position.set(x, 0, z);
            // Self rotation
            meshRef.current.rotation.y += 0.02 * timeSpeed * timeDirection * effectiveDelta * 60;
        }
    });

    // Use HD texture when parent planet is selected
    const activeTexture = moon.texture
        ? (isParentSelected && moon.textureHD ? moon.textureHD : moon.texture)
        : null;

    return (
        <group>
            {/* Moon Orbital Path */}
            {showOrbitLines && (
                <mesh ref={orbitRef} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[moon.distance - (moon.distance * 0.005), moon.distance + (moon.distance * 0.005), 64]} />
                    <meshBasicMaterial color="white" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Moon Mesh */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[moon.size, 16, 16]} />
                {activeTexture ? (
                    <TexturedMoonMaterial texture={activeTexture} />
                ) : (
                    <meshStandardMaterial color={moon.color || '#888888'} depthWrite={true} depthTest={true} />
                )}
            </mesh>
        </group>
    );
});

export default Moon;

