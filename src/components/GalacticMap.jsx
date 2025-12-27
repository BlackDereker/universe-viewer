import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Import shaders from separate files
import starVertexShader from '../shaders/galacticStarVertex.glsl?raw';
import starFragmentShader from '../shaders/galacticStarFragment.glsl?raw';

const GalacticMap = ({
    systems,
    currentSystemName,
    onSelectSystem,
    searchTerm,
    hoveredSystem,
    setHoveredSystem
}) => {
    const pointsRef = useRef();
    const { camera, raycaster, pointer } = useThree();
    const [time, setTime] = useState(0);

    // Track drag state to prevent click after dragging
    const dragStateRef = useRef({ startX: 0, startY: 0, isDragging: false });

    // Build geometry data from systems
    const { positions, colors, sizes, highlighted, systemIndices } = useMemo(() => {
        if (!systems || systems.length === 0) {
            return {
                positions: new Float32Array(0),
                colors: new Float32Array(0),
                sizes: new Float32Array(0),
                highlighted: new Float32Array(0),
                systemIndices: []
            };
        }

        const count = systems.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const highlighted = new Float32Array(count);
        const systemIndices = [];

        const lowerSearch = (searchTerm || '').toLowerCase();

        systems.forEach((system, i) => {
            // Position
            positions[i * 3] = system.position.x;
            positions[i * 3 + 1] = system.position.y;
            positions[i * 3 + 2] = system.position.z;

            // Color from star type
            const color = new THREE.Color(system.starColor || '#ffffff');
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Size based on planet count (more planets = larger star point)
            sizes[i] = 3 + Math.min(system.planetCount, 8) * 1.5;

            // Highlight current system or search matches
            const isCurrentSystem = system.hostname === currentSystemName;
            const matchesSearch = lowerSearch && system.hostname.toLowerCase().includes(lowerSearch);
            highlighted[i] = isCurrentSystem || matchesSearch ? 1.0 : 0.0;

            // Dim non-matching stars when searching
            if (lowerSearch && !matchesSearch && !isCurrentSystem) {
                colors[i * 3] *= 0.2;
                colors[i * 3 + 1] *= 0.2;
                colors[i * 3 + 2] *= 0.2;
                sizes[i] *= 0.5;
            }

            systemIndices.push(system);
        });

        return { positions, colors, sizes, highlighted, systemIndices };
    }, [systems, currentSystemName, searchTerm]);

    // Hover state array
    const hovered = useMemo(() => {
        const arr = new Float32Array(systems?.length || 0);
        if (hoveredSystem && systems) {
            const idx = systems.findIndex(s => s.hostname === hoveredSystem.hostname);
            if (idx >= 0) arr[idx] = 1.0;
        }
        return arr;
    }, [systems, hoveredSystem]);

    // Shader material
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: starVertexShader,
            fragmentShader: starFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }, []);

    // Animation loop
    useFrame((state, delta) => {
        setTime(t => t + delta);
        if (shaderMaterial) {
            shaderMaterial.uniforms.time.value = time;
        }

        // Update hover attribute
        if (pointsRef.current && pointsRef.current.geometry.attributes.isHovered) {
            pointsRef.current.geometry.attributes.isHovered.array.set(hovered);
            pointsRef.current.geometry.attributes.isHovered.needsUpdate = true;
        }

        // Update color, size, and highlight attributes when search term changes
        if (pointsRef.current) {
            const geom = pointsRef.current.geometry;
            if (geom.attributes.customColor) {
                geom.attributes.customColor.array.set(colors);
                geom.attributes.customColor.needsUpdate = true;
            }
            if (geom.attributes.size) {
                geom.attributes.size.array.set(sizes);
                geom.attributes.size.needsUpdate = true;
            }
            if (geom.attributes.isHighlighted) {
                geom.attributes.isHighlighted.array.set(highlighted);
                geom.attributes.isHighlighted.needsUpdate = true;
            }
        }
    });

    // Raycasting for hover/click detection
    const handlePointerMove = useCallback((event) => {
        if (!pointsRef.current || !systems || systems.length === 0) return;

        raycaster.setFromCamera(pointer, camera);
        raycaster.params.Points.threshold = 5;

        const intersects = raycaster.intersectObject(pointsRef.current);

        if (intersects.length > 0) {
            const idx = intersects[0].index;
            if (idx !== undefined && systemIndices[idx]) {
                setHoveredSystem(systemIndices[idx]);
            }
        } else {
            setHoveredSystem(null);
        }
    }, [systems, systemIndices, camera, raycaster, pointer, setHoveredSystem]);

    // Track pointer down position to detect drags
    const handlePointerDown = useCallback((event) => {
        dragStateRef.current.startX = event.clientX;
        dragStateRef.current.startY = event.clientY;
        dragStateRef.current.isDragging = false;
    }, []);

    const handleClick = useCallback((event) => {
        if (!pointsRef.current || !systems || systems.length === 0) return;

        // Check if this was a drag operation (pointer moved more than 5 pixels)
        const dx = event.clientX - dragStateRef.current.startX;
        const dy = event.clientY - dragStateRef.current.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
            // This was a drag, not a click - ignore
            return;
        }

        raycaster.setFromCamera(pointer, camera);
        raycaster.params.Points.threshold = 5;

        const intersects = raycaster.intersectObject(pointsRef.current);

        if (intersects.length > 0) {
            const idx = intersects[0].index;
            if (idx !== undefined && systemIndices[idx]) {
                onSelectSystem(systemIndices[idx].hostname);
            }
        }
    }, [systems, systemIndices, camera, raycaster, pointer, onSelectSystem]);

    if (!systems || systems.length === 0) return null;

    return (
        <group>
            {/* Star points */}
            <points
                ref={pointsRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onClick={handleClick}
            >
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-customColor"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-size"
                        count={sizes.length}
                        array={sizes}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-isHighlighted"
                        count={highlighted.length}
                        array={highlighted}
                        itemSize={1}
                    />
                    <bufferAttribute
                        attach="attributes-isHovered"
                        count={hovered.length}
                        array={hovered}
                        itemSize={1}
                    />
                </bufferGeometry>
                <primitive object={shaderMaterial} attach="material" />
            </points>

            {/* Galactic grid reference */}
            <gridHelper args={[1000, 20, '#1a1a3a', '#0a0a1a']} rotation={[0, 0, 0]} />

            {/* Origin marker (Solar System reference) */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[2, 16, 16]} />
                <meshBasicMaterial color="#ffcc00" transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

export default GalacticMap;
