import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ProceduralPlanetMaterial from '../ProceduralPlanetMaterial';
import EarthMaterial from '../EarthMaterial';
import Atmosphere from '../Atmosphere';
import Rings from '../Rings';

const TexturedMaterial = ({ texture, ...props }) => {
    const map = useTexture(texture);
    return <meshStandardMaterial map={map} depthWrite={true} depthTest={true} transparent={false} {...props} />;
};

const ComparisonPlanet = ({ planet }) => {
    const meshRef = useRef();
    const isEarth = planet.name === 'Earth';

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Constant rotation for visualization
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group>
            {/* Axial Tilt Group */}
            <group rotation={[planet.axialTilt || 0, 0, 0]}>
                <mesh ref={meshRef}>
                    <sphereGeometry args={[planet.size, 64, 64]} />
                    {isEarth ? (
                        <EarthMaterial isSelected={false} />
                    ) : planet.isProcedural ? (
                        <ProceduralPlanetMaterial planet={planet} />
                    ) : planet.texture ? (
                        <TexturedMaterial
                            texture={planet.textureHD || planet.texture}
                            color="white"
                        />
                    ) : (
                        <meshStandardMaterial
                            color={planet.color}
                            roughness={0.7}
                            metalness={0.1}
                        />
                    )}
                </mesh>

                {/* Atmospheric Scattering Halo */}
                {!planet.isDwarf && (
                    <Atmosphere
                        radius={planet.size}
                        color={planet.planetType === 'gas' ? planet.color : (planet.temperature > 450 ? '#ff6622' : '#4488ff')}
                        strength={planet.planetType === 'gas' ? 0.8 : 0.5}
                    />
                )}

                {/* Planetary Rings */}
                {planet.rings && (
                    <Rings
                        innerRadius={planet.size * planet.rings.inner}
                        outerRadius={planet.size * planet.rings.outer}
                        color={planet.rings.color || planet.color}
                    />
                )}
            </group>
        </group>
    );
};

export default ComparisonPlanet;
