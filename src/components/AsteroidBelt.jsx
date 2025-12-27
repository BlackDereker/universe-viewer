import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AsteroidBelt = ({ innerRadius, outerRadius, count, color, timeSpeed, useRealDistances, isPaused, timeDirection, stepFrame }) => {
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const currentInner = useRef(innerRadius);
    const currentOuter = useRef(outerRadius);
    const lastStepFrame = useRef(stepFrame);
    
    // Generate random positions and scales for asteroids
    // We use normalized values so we can scale the radius dynamically
    const asteroids = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radiusOffset = Math.random(); // 0 to 1
            const y = (Math.random() - 0.5) * 2; // Vertical spread
            
            const scale = 0.02 + Math.random() * 0.05;
            const rotation = Math.random() * Math.PI;
            
            temp.push({ y, scale, rotation, angle, radiusOffset });
        }
        return temp;
    }, [count]);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        // Calculate effective delta (0 when paused, unless stepping)
        const isStepFrame = stepFrame !== lastStepFrame.current;
        lastStepFrame.current = stepFrame;
        const effectiveDelta = isPaused && !isStepFrame ? 0 : (isStepFrame ? 0.016 : delta);

        // Smoothly interpolate radii (always runs for smooth transitions)
        currentInner.current = THREE.MathUtils.lerp(currentInner.current, innerRadius, 0.05);
        currentOuter.current = THREE.MathUtils.lerp(currentOuter.current, outerRadius, 0.05);

        asteroids.forEach((asteroid, i) => {
            // Calculate current radius based on interpolated bounds
            const radius = currentInner.current + asteroid.radiusOffset * (currentOuter.current - currentInner.current);
            
            // Update angle for rotation (slower for further asteroids)
            asteroid.angle += effectiveDelta * 0.01 * timeSpeed * timeDirection * (20 / Math.sqrt(radius));
            
            const x = Math.cos(asteroid.angle) * radius;
            const z = Math.sin(asteroid.angle) * radius;
            
            dummy.position.set(x, asteroid.y, z);
            dummy.rotation.set(asteroid.rotation, asteroid.rotation, asteroid.rotation);
            dummy.scale.set(asteroid.scale, asteroid.scale, asteroid.scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
                color={color} 
                roughness={0.8} 
                metalness={0.2}
                emissive={color}
                emissiveIntensity={0.1}
                depthWrite={true}
                depthTest={true}
            />
        </instancedMesh>
    );
};

export default AsteroidBelt;
