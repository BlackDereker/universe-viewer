import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CameraController = ({ selectedPlanet, selectedMoon, planetRefs, moonRefs }) => {
    const { camera, controls } = useThree();
    const isTransitioning = useRef(false);
    const previousSelection = useRef(null);
    const previousMoonSelection = useRef(null);

    useEffect(() => {
        const planetChanged = selectedPlanet?.name !== previousSelection.current?.name;
        const moonChanged = selectedMoon?.name !== previousMoonSelection.current?.name;

        if (planetChanged || moonChanged) {
            isTransitioning.current = true;
            previousSelection.current = selectedPlanet;
            previousMoonSelection.current = selectedMoon;

            // If changing focus, ensure controls are enabled
            if (controls) {
                controls.enabled = true;
            }
        }
    }, [selectedPlanet, selectedMoon, controls]);

    useFrame((state, delta) => {
        if (!controls) return;

        // Target updating logic
        const target = new THREE.Vector3();

        // Determine what to focus on: Moon takes priority if selected
        let focusObject = null;
        let focusSize = 1;

        if (selectedMoon && moonRefs.current[selectedMoon.name]) {
            focusObject = moonRefs.current[selectedMoon.name];
            focusSize = selectedMoon.size;
        } else if (selectedPlanet && planetRefs.current[selectedPlanet.name]) {
            focusObject = planetRefs.current[selectedPlanet.name];
            focusSize = selectedPlanet.size;
        }

        if (focusObject) {
            // CRITICAL: Update world matrix before getting position to prevent lag
            focusObject.updateMatrixWorld();
            focusObject.getWorldPosition(target);

            // Camera Zoom/Follow Logic
            if (isTransitioning.current) {
                // Smoothly move orbit target to object during transition
                controls.target.lerp(target, 0.1);

                // Allow closer zoom for smaller objects, but keep a safe distance
                const desiredDistance = Math.max(focusSize * 6, 2);
                const currentDistance = camera.position.distanceTo(target);

                // If we're too far, zoom in
                if (Math.abs(currentDistance - desiredDistance) > 0.1) {
                    const direction = new THREE.Vector3()
                        .subVectors(camera.position, target)
                        .normalize();

                    const desiredPosition = target.clone().add(direction.multiplyScalar(desiredDistance));
                    camera.position.lerp(desiredPosition, 0.05);
                } else {
                    isTransitioning.current = false;
                }
            } else {
                // LOCK/FOLLOW MODE: Once transition is done, stick to the object perfectly
                const deltaMove = new THREE.Vector3().subVectors(target, controls.target);
                controls.target.copy(target);
                camera.position.add(deltaMove);
            }
        } else {
            // No planet selected: Focus on Sun (0,0,0)
            target.set(0, 0, 0);

            if (isTransitioning.current) {
                controls.target.lerp(target, 0.05);

                // Pull camera back to a default overview distance (similar to initial view)
                const desiredDistance = 80;
                const currentDistance = camera.position.distanceTo(target);

                if (Math.abs(currentDistance - desiredDistance) > 0.5) {
                    const direction = new THREE.Vector3()
                        .subVectors(camera.position, target)
                        .normalize();

                    // Maintain some height (Y) in the overview
                    const desiredPosition = target.clone().add(direction.multiplyScalar(desiredDistance));
                    desiredPosition.y = Math.max(desiredPosition.y, 30); 

                    camera.position.lerp(desiredPosition, 0.04);
                } else {
                    isTransitioning.current = false;
                }
            } else {
                controls.target.lerp(target, 0.1);
            }
        }

        // Update controls to apply changes
        controls.update();
    }, 1); // Priority 1 ensures this runs AFTER the planet/moon position updates (Priority 0)

    return null;
};

export default CameraController;
