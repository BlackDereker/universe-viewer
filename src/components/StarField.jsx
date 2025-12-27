import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { getAssetPath } from '../utils/assetPath';

// A small subset of the brightest stars (Magnitude < 4.0)
// Format: [RA(deg), Dec(deg), Dist(pc), Mag, ColorIndex]
const BRIGHT_STARS_DATA = [
    [101.28, -16.71, 2.6, -1.46, -0.03], // Sirius
    [95.98, -52.69, 95.9, -0.74, 0.15],  // Canopus
    [219.9, -60.83, 1.3, -0.27, 0.71],   // Alpha Centauri
    [213.91, 19.18, 11.2, -0.05, 1.23],  // Arcturus
    [279.23, 38.78, 7.7, 0.03, 0.0],     // Vega
    [78.63, 7.4, 150, 0.12, 1.85],       // Betelgeuse
    [77.35, -8.2, 260, 0.18, -0.03],     // Rigel
    [114.82, 5.22, 3.5, 0.4, 0.42],      // Procyon
    [247.35, -26.43, 170, 0.96, 1.83],   // Antares
    [68.98, 16.5, 20, 0.85, 1.54],       // Aldebaran
    [297.69, 8.86, 5.1, 0.77, 0.22],     // Altair
    [310.35, 45.28, 430, 1.25, 0.09],    // Deneb
    [116.32, 28.02, 10.3, 1.14, 0.48],   // Pollux
    [152.09, 11.96, 23.8, 1.35, 0.11],   // Regulus
    [201.29, -11.16, 77, 0.98, -0.23],   // Spica
    [210.95, -60.37, 161, 0.61, -0.22],  // Hadar
    [187.79, -63.09, 98, 0.77, -0.19],   // Acrux
    [103.55, 31.88, 15.6, 1.58, 0.0],    // Castor
    [26.57, -17.98, 18, 2.04, 1.12],     // Diphda
    [37.95, 89.26, 132, 1.97, 0.6],      // Polaris
    [165.93, 56.38, 24, 1.79, 0.0],      // Alioth (Big Dipper)
    [206.88, 49.31, 31, 1.85, 0.0],      // Alkaid (Big Dipper)
    [165.46, 61.75, 25, 2.27, 0.0],      // Mizar (Big Dipper)
    [137.67, 53.69, 24, 1.81, 0.0],      // Dubhe (Big Dipper)
    [163.48, 53.7, 25, 2.37, 0.0],       // Megrez (Big Dipper)
    [118.47, 5.22, 3.5, 0.4, 0.42],      // Procyon
    [81.28, 6.35, 150, 0.5, 1.85],       // Bellatrix
    [83.0, -0.3, 400, 1.69, -0.22],      // Alnilam (Orion's Belt)
    [84.05, -1.2, 380, 1.74, -0.19],     // Alnitak (Orion's Belt)
    [80.5, -0.3, 280, 2.23, -0.22],      // Mintaka (Orion's Belt)
];

// Generate a deterministic set of background stars based on RA/Dec
const generateBackgroundStars = (count) => {
    const stars = [];
    const seed = 12345;
    const random = (i) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
        const ra = random(i * 3) * 360;
        const dec = (random(i * 3 + 1) * 180) - 90;
        const dist = 500 + random(i * 3 + 2) * 2000; // Distant stars
        const mag = 4.0 + random(i * 3 + 3) * 4.0; // Fainter stars
        const colorIdx = (random(i * 3 + 4) * 2.0) - 0.5;
        stars.push([ra, dec, dist, mag, colorIdx]);
    }
    return stars;
};

const BACKGROUND_STARS = generateBackgroundStars(3000);

const StarField = ({ currentSystem }) => {
    const pointsRef = useRef();
    const sunTexture = useTexture(getAssetPath('textures/sun.png'));

    const starPositions = useMemo(() => {
        const allStars = [...BRIGHT_STARS_DATA, ...BACKGROUND_STARS];
        const count = allStars.length;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        // Current system position in parsecs
        const sysRA = (currentSystem?.coords?.ra || 0) * (Math.PI / 180);
        const sysDec = (currentSystem?.coords?.dec || 0) * (Math.PI / 180);
        const sysDist = currentSystem?.coords?.dist || 0;

        const sysX = sysDist * Math.cos(sysDec) * Math.cos(sysRA);
        const sysY = sysDist * Math.cos(sysDec) * Math.sin(sysRA);
        const sysZ = sysDist * Math.sin(sysDec);

        allStars.forEach((star, i) => {
            const ra = star[0] * (Math.PI / 180);
            const dec = star[1] * (Math.PI / 180);
            const dist = star[2];
            const mag = star[3];
            const colorIdx = star[4];

            // Absolute position of the star
            const x = dist * Math.cos(dec) * Math.cos(ra);
            const y = dist * Math.cos(dec) * Math.sin(ra);
            const z = dist * Math.sin(dec);

            // Relative position to current system
            const relX = x - sysX;
            const relY = y - sysY;
            const relZ = z - sysZ;

            // Normalize and push to a large sphere for background rendering
            const vector = new THREE.Vector3(relX, relY, relZ).normalize().multiplyScalar(15000);
            positions[i * 3] = vector.x;
            positions[i * 3 + 1] = vector.y;
            positions[i * 3 + 2] = vector.z;

            // Color based on B-V index
            const color = new THREE.Color();
            if (colorIdx < 0) color.setHSL(0.6, 0.3, 0.9);
            else if (colorIdx < 0.5) color.setHSL(0.15, 0.1, 0.9);
            else color.setHSL(0.05, 0.5, 0.8);

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Size based on magnitude
            sizes[i] = Math.max(0.5, 4.0 - mag * 0.6);
        });

        return { positions, colors, sizes };
    }, [currentSystem]);

    return (
        <group>
            <points ref={pointsRef} renderOrder={-2}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={starPositions.positions.length / 3}
                        array={starPositions.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={starPositions.colors.length / 3}
                        array={starPositions.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={1.0}
                    sizeAttenuation={false}
                    vertexColors
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Milky Way Band - Simplified as a dense ring of points */}
            <points renderOrder={-2}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={2000}
                        array={new Float32Array([...Array(6000)].map((_, i) => {
                            const angle = Math.random() * Math.PI * 2;
                            const spread = (Math.random() - 0.5) * 0.3;
                            const v = new THREE.Vector3(
                                Math.cos(angle),
                                spread,
                                Math.sin(angle)
                            ).normalize().multiplyScalar(15000);
                            // Rotate to match galactic plane (roughly)
                            v.applyAxisAngle(new THREE.Vector3(1, 0, 0), 1.1);
                            return i % 3 === 0 ? v.x : (i % 3 === 1 ? v.y : v.z);
                        }))}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={4}
                    sizeAttenuation={false}
                    color="#4455aa"
                    transparent
                    opacity={0.5}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};

export default StarField;

