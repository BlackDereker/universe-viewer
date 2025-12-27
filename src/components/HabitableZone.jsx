import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import habitableZoneVertexShader from '../shaders/habitableZoneVertex.glsl?raw';
import habitableZoneFragmentShader from '../shaders/habitableZoneFragment.glsl?raw';

/**
 * Habitable Zone Visualization Component
 * Features smooth gradient fades at the inner and outer edges
 */
const HabitableZone = ({ starTemp, starSize, planets, useRealDistances, scaleFactor = 50 }) => {
    const meshRef = useRef();
    const materialRef = useRef();
    const currentInner = useRef(null);
    const currentOuter = useRef(null);

    // Calculate target habitable zone boundaries
    const targets = useMemo(() => {
        const sunTemp = 5778;
        const tempRatio = (starTemp || sunTemp) / sunTemp;
        const radiusRatio = (starSize / 3) || 1;
        const luminosity = Math.pow(radiusRatio, 2) * Math.pow(tempRatio, 4);

        const innerUnits = 0.95 * Math.sqrt(luminosity) * scaleFactor;
        const outerUnits = 1.37 * Math.sqrt(luminosity) * scaleFactor;

        if (useRealDistances) {
            return { inner: innerUnits, outer: outerUnits };
        } else {
            const interpolateCompact = (targetRealDist) => {
                if (!planets || planets.length === 0) return starSize + 5;
                const sorted = [...planets].sort((a, b) => a.actualDistance - b.actualDistance);

                if (targetRealDist <= sorted[0].actualDistance) {
                    const ratio = targetRealDist / sorted[0].actualDistance;
                    return Math.max(starSize + 0.5, starSize + (sorted[0].orderedDistance - starSize) * ratio);
                }

                for (let i = 0; i < sorted.length - 1; i++) {
                    const p1 = sorted[i];
                    const p2 = sorted[i + 1];
                    if (targetRealDist >= p1.actualDistance && targetRealDist <= p2.actualDistance) {
                        const range = p2.actualDistance - p1.actualDistance;
                        const progress = (targetRealDist - p1.actualDistance) / range;
                        return p1.orderedDistance + (p2.orderedDistance - p1.orderedDistance) * progress;
                    }
                }

                const last = sorted[sorted.length - 1];
                const ratio = targetRealDist / last.actualDistance;
                return last.orderedDistance * ratio;
            };

            return {
                inner: interpolateCompact(innerUnits),
                outer: interpolateCompact(outerUnits)
            };
        }
    }, [starTemp, starSize, planets, useRealDistances, scaleFactor]);

    // Create shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color('#22ff88') },
                uInnerRadius: { value: targets.inner },
                uOuterRadius: { value: targets.outer },
                uOpacity: { value: 0.2 }
            },
            vertexShader: habitableZoneVertexShader,
            fragmentShader: habitableZoneFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true,
            polygonOffset: true,
            polygonOffsetFactor: 1,
            polygonOffsetUnits: 1
        });
    }, []);

    // Initialize refs
    if (currentInner.current === null) currentInner.current = targets.inner;
    if (currentOuter.current === null) currentOuter.current = targets.outer;

    useFrame(() => {
        if (!meshRef.current || !shaderMaterial) return;

        // Smoothly interpolate radii
        currentInner.current = THREE.MathUtils.lerp(currentInner.current, targets.inner, 0.05);
        currentOuter.current = THREE.MathUtils.lerp(currentOuter.current, targets.outer, 0.05);

        // Update shader uniforms
        shaderMaterial.uniforms.uInnerRadius.value = currentInner.current;
        shaderMaterial.uniforms.uOuterRadius.value = currentOuter.current;

        // Update geometry
        const geometry = new THREE.RingGeometry(currentInner.current, currentOuter.current, 128);
        geometry.rotateX(-Math.PI / 2);

        if (meshRef.current.geometry) {
            meshRef.current.geometry.dispose();
        }
        meshRef.current.geometry = geometry;
    });

    return (
        <mesh ref={meshRef} position={[0, -0.05, 0]}>
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
};

export default HabitableZone;

