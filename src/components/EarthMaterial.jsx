import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import earthVertexShader from '../shaders/earthVertex.glsl?raw';
import earthFragmentShader from '../shaders/earthFragment.glsl?raw';
import { getAssetPath } from '../utils/assetPath';

const EarthMaterial = ({ isSelected }) => {
    const materialRef = useRef();

    // Load all Earth textures - use HD when selected
    const [dayMap, nightMap, cloudMap, specularMap, normalMap] = useTexture([
        getAssetPath(isSelected ? 'textures/8k_earth_daymap.jpg' : 'textures/2k_earth_daymap.jpg'),
        getAssetPath(isSelected ? 'textures/8k_earth_nightmap.jpg' : 'textures/2k_earth_nightmap.jpg'),
        getAssetPath(isSelected ? 'textures/8k_earth_clouds.jpg' : 'textures/2k_earth_clouds.jpg'),
        getAssetPath(isSelected ? 'textures/8k_earth_specular_map.png' : 'textures/2k_earth_specular_map.png'),
        getAssetPath(isSelected ? 'textures/8k_earth_normal_map.png' : 'textures/2k_earth_normal_map.png')
    ]);

    const uniforms = useMemo(() => ({
        uDayMap: { value: dayMap },
        uNightMap: { value: nightMap },
        uCloudMap: { value: cloudMap },
        uSpecularMap: { value: specularMap },
        uNormalMap: { value: normalMap },
        uTime: { value: 0 }
    }), [dayMap, nightMap, cloudMap, specularMap, normalMap]);

    // Update uniforms when textures change
    useMemo(() => {
        if (materialRef.current) {
            materialRef.current.uniforms.uDayMap.value = dayMap;
            materialRef.current.uniforms.uNightMap.value = nightMap;
            materialRef.current.uniforms.uCloudMap.value = cloudMap;
            materialRef.current.uniforms.uSpecularMap.value = specularMap;
            materialRef.current.uniforms.uNormalMap.value = normalMap;
        }
    }, [dayMap, nightMap, cloudMap, specularMap, normalMap]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            vertexShader={earthVertexShader}
            fragmentShader={earthFragmentShader}
            uniforms={uniforms}
            depthWrite={true}
            depthTest={true}
            transparent={false}
        />
    );
};

export default EarthMaterial;
