import { useEffect, useState } from 'react';
import { useTexture } from '@react-three/drei';

// Essential 2K textures needed immediately for initial render
const ESSENTIAL_TEXTURES = [
    '/textures/2k_mercury.jpg',
    '/textures/2k_venus_atmosphere.jpg',
    '/textures/2k_earth_daymap.jpg',
    '/textures/2k_earth_nightmap.jpg',
    '/textures/2k_earth_clouds.jpg',
    '/textures/2k_earth_specular_map.png',
    '/textures/2k_earth_normal_map.png',
    '/textures/2k_moon.jpg',
    '/textures/2k_mars.jpg',
    '/textures/2k_jupiter.jpg',
    '/textures/2k_saturn.jpg',
    '/textures/2k_neptune.jpg',
    '/textures/2k_uranus.jpg',
    '/textures/2k_sun.jpg',
];

// HD textures loaded in background after initial render
const HD_TEXTURES = [
    '/textures/8k_mercury.jpg',
    '/textures/4k_venus_atmosphere.jpg',
    '/textures/8k_earth_daymap.jpg',
    '/textures/8k_earth_nightmap.jpg',
    '/textures/8k_earth_clouds.jpg',
    '/textures/8k_earth_specular_map.png',
    '/textures/8k_earth_normal_map.png',
    '/textures/8k_moon.jpg',
    '/textures/8k_mars.jpg',
    '/textures/4k_ceres_fictional.jpg',
    '/textures/8k_jupiter.jpg',
    '/textures/8k_saturn.jpg',
    '/textures/4k_haumea_fictional.jpg',
    '/textures/4k_makemake_fictional.jpg',
    '/textures/4k_eris_fictional.jpg',
];

// Preload essential textures when this component mounts
const TexturePreloader = () => {
    const [loadHD, setLoadHD] = useState(false);

    // Load essential 2K textures immediately
    useTexture(ESSENTIAL_TEXTURES);

    // Schedule HD texture loading after a delay (to not block initial render)
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadHD(true);
            // Start preloading HD textures in background
            HD_TEXTURES.forEach(url => {
                useTexture.preload(url);
            });
        }, 2000); // Wait 2 seconds after initial load

        return () => clearTimeout(timer);
    }, []);

    return null;
};

// Preload only essential textures on module load
ESSENTIAL_TEXTURES.forEach(url => {
    useTexture.preload(url);
});

export default TexturePreloader;
