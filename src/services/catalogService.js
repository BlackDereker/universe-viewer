// Use static data file to avoid CORS issues on static hosts like GitHub Pages
import { getAssetPath } from '../utils/assetPath';

const NASA_DATA_URL = import.meta.env.BASE_URL + 'data/exoplanets.csv';

let catalogCache = null;

const parseCSV = (csvText) => {
    // Split by lines and filter out empty lines or NASA comments (starting with #)
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'));
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));

    return lines.slice(1).map(line => {
        // Simple CSV split that handles quotes for NASA data
        const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
        const entry = {};
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });
        return entry;
    }).filter(entry => entry.pl_name);
};

export const initCatalog = async () => {
    if (catalogCache) return catalogCache;

    try {
        const response = await fetch(NASA_DATA_URL);
        if (!response.ok) throw new Error('Failed to fetch exoplanet data');
        const text = await response.text();
        catalogCache = parseCSV(text);
        return catalogCache;
    } catch (error) {
        console.error('Error initializing exoplanet catalog:', error);
        throw error;
    }
};

const getStarType = (temp) => {
    if (!temp || isNaN(temp)) return 'Unknown';
    if (temp < 3700) return 'M-type (Red Dwarf)';
    if (temp < 5200) return 'K-type (Orange)';
    if (temp < 6000) return 'G-type (Yellow)';
    if (temp < 7500) return 'F-type (White)';
    if (temp < 10000) return 'A-type (Blue-White)';
    return 'O/B-type (Blue)';
};

const getStarIndicatorColor = (temp) => {
    if (!temp || isNaN(temp)) return '#888888';
    if (temp < 3700) return '#ff4400';
    if (temp < 5200) return '#ffaa00';
    if (temp < 6000) return '#ffdd00';
    if (temp < 7500) return '#ffffcc';
    if (temp < 10000) return '#ccddff';
    return '#aaccff';
};

export const searchSystems = async (searchTerm) => {
    const catalog = await initCatalog();
    const lowerSearch = searchTerm.toLowerCase();

    // Group by hostname with planet count and star info
    const systemsMap = new Map();
    catalog.forEach(item => {
        if (item.hostname.toLowerCase().includes(lowerSearch)) {
            if (!systemsMap.has(item.hostname)) {
                const starTemp = parseFloat(item.st_teff);
                systemsMap.set(item.hostname, {
                    hostname: item.hostname,
                    planetCount: 0,
                    starTemp: starTemp || null,
                    starType: getStarType(starTemp),
                    starColor: getStarIndicatorColor(starTemp)
                });
            }
            systemsMap.get(item.hostname).planetCount++;
        }
    });

    return Array.from(systemsMap.values()).slice(0, 10);
};

// Build a summary of all systems for browsing/filtering
const buildSystemsSummary = async () => {
    const catalog = await initCatalog();
    const systemsMap = new Map();

    catalog.forEach(item => {
        if (!systemsMap.has(item.hostname)) {
            const starTemp = parseFloat(item.st_teff);
            systemsMap.set(item.hostname, {
                hostname: item.hostname,
                planetCount: 0,
                starTemp: starTemp || null,
                starType: getStarType(starTemp),
                starColor: getStarIndicatorColor(starTemp),
                discoveryYear: parseInt(item.disc_year) || null
            });
        }
        systemsMap.get(item.hostname).planetCount++;
    });

    return Array.from(systemsMap.values());
};

// Get featured/notable exoplanet systems
export const getFeaturedSystems = async () => {
    const allSystems = await buildSystemsSummary();

    // Curated list of notable systems
    const featuredNames = [
        'TRAPPIST-1',      // 7 Earth-sized planets
        'Kepler-186',      // First Earth-sized planet in habitable zone
        'Kepler-90',       // 8-planet system like ours
        'Proxima Cen',     // Closest star system
        'TOI-700',         // Earth-sized planet in habitable zone
        'Kepler-452',      // "Earth's cousin"
        'Kepler-22',       // First confirmed planet in habitable zone
        'HD 10180',        // Multi-planet system
        'LHS 1140',        // Super-Earth in habitable zone
        'GJ 1061'          // Nearby system with planets
    ];

    const featured = [];
    for (const name of featuredNames) {
        const system = allSystems.find(s => s.hostname.toLowerCase() === name.toLowerCase());
        if (system) {
            featured.push({ ...system, isFeatured: true });
        }
    }

    return featured;
};

// Get random systems for discovery
export const getRandomSystems = async (count = 8) => {
    const allSystems = await buildSystemsSummary();

    // Fisher-Yates shuffle
    const shuffled = [...allSystems];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
};

// Get systems filtered by star type
export const getSystemsByStarType = async (starTypePrefix) => {
    const allSystems = await buildSystemsSummary();

    return allSystems
        .filter(s => s.starType.startsWith(starTypePrefix))
        .sort((a, b) => b.planetCount - a.planetCount) // Sort by planet count
        .slice(0, 10);
};

// Favorites management
const FAVORITES_KEY = 'universe_viewer_favorites';

export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Failed to parse favorites:', e);
        return [];
    }
};

export const saveFavorites = (favorites) => {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
        console.error('Failed to save favorites:', e);
    }
};

export const toggleFavoriteSystem = (hostname) => {
    const favorites = getFavorites();
    const index = favorites.indexOf(hostname);
    let newFavorites;
    if (index === -1) {
        newFavorites = [...favorites, hostname];
    } else {
        newFavorites = favorites.filter(h => h !== hostname);
    }
    saveFavorites(newFavorites);
    return newFavorites;
};

export const getFavoriteSystems = async () => {
    const favorites = getFavorites();
    if (favorites.length === 0) return [];

    const allSystems = await buildSystemsSummary();
    const favoriteSystems = [];

    // Maintain order of favorites if possible, or just filter
    // We'll map favorites to system data
    for (const hostname of favorites) {
        // Special case for Solar System if it's not in the main catalog map properly
        if (hostname === 'Solar System') {
            // Solar System needs to be constructed manually if not found in catalog cache
            favoriteSystems.push({
                hostname: 'Solar System',
                planetCount: 8,
                starType: 'G-type (Yellow)',
                starColor: '#ffffff',
                discoveryYear: null,
                isFavorite: true
            });
            continue;
        }

        const system = allSystems.find(s => s.hostname === hostname);
        if (system) {
            favoriteSystems.push({ ...system, isFavorite: true });
        }
    }

    return favoriteSystems;
};

export const fetchSystemData = async (hostname) => {
    const catalog = await initCatalog();
    const systemPlanets = catalog.filter(item =>
        item.hostname.toLowerCase() === hostname.toLowerCase()
    );

    if (systemPlanets.length === 0) throw new Error('System not found');

    const first = systemPlanets[0];

    const getStarColor = (teff) => {
        const temp = parseFloat(teff);
        if (isNaN(temp)) return '#ffdd00';
        if (temp < 3700) return '#ff4400';
        if (temp < 5200) return '#ffaa00';
        if (temp < 6000) return '#ffdd00';
        if (temp < 7500) return '#ffffcc';
        return '#ccf2ff';
    };

    const starSize = (parseFloat(first.st_rad) || 1) * 3;
    const planets = systemPlanets.map((p, index) => {
        const radiusEarth = parseFloat(p.pl_rade) || 1;
        const size = radiusEarth * 0.15;
        const distAU = parseFloat(p.pl_orbper) ? Math.pow(parseFloat(p.pl_orbper) / 365, 2 / 3) : (index + 1) * 0.5;
        const actualDistance = distAU * 50;

        // Calculate a more realistic planet temperature based on distance and star properties
        // T_planet = T_star * sqrt(R_star / (2 * distance))
        // distance in AU, R_star in Solar Radii. 1 AU = 215 Solar Radii.
        const starRad = parseFloat(first.st_rad) || 1;
        const starTeff = parseFloat(first.st_teff) || 5778;
        const planetTemp = starTeff * Math.sqrt(starRad / (2 * 215 * distAU));

        // Procedural Ring Generation for Cold Gas Giants
        // Criteria: Radius > 6 Earth Radii (Gas Giant) AND 50% chance
        let rings = null;
        if (radiusEarth > 6.0 && Math.random() > 0.5) {
            rings = {
                inner: 1.2,
                outer: 1.5 + Math.random(), // 1.5 to 2.5
                color: getRandomPlanetColor(index),
                opacity: 0.3 + Math.random() * 0.4,
                isProcedural: true
            };
        }

        // Procedural Moon Generation
        const moons = [];
        let moonsProcedural = false;
        if (radiusEarth > 2.0) { // Only planets larger than 2 Earth radii get moons
            moonsProcedural = true;
            const moonCount = Math.floor(Math.random() * (radiusEarth > 8 ? 5 : 3));
            for (let i = 0; i < moonCount; i++) {
                moons.push({
                    name: `${p.pl_name} ${String.fromCharCode(105 + i)}`, // i, ii, iii...
                    size: size * (0.1 + Math.random() * 0.2),
                    distance: size * (2 + i * 1.5 + Math.random()),
                    speed: (0.5 + Math.random() * 1.5) * 0.01,
                    color: '#888888'
                });
            }
        }

        return {
            name: p.pl_name,
            color: getRandomPlanetColor(index),
            size,
            actualDistance,
            rings,
            moons,
            moonsProcedural,
            speed: 0.1 / (parseFloat(p.pl_orbper) || 365),
            description: `Planet ${p.pl_name}. Orbital period: ${p.pl_orbper || 'unknown'} days. Discovery method: ${p.discoverymethod || 'unknown'}.`,
            isProcedural: true,
            planetType: radiusEarth > 6 ? 'gas' : (radiusEarth > 1.5 ? 'super-earth' : 'rocky'),
            temperature: planetTemp,
            seed: Math.random()
        };
    });

    // Sort planets by actual distance to ensure order
    planets.sort((a, b) => a.actualDistance - b.actualDistance);

    // Calculate orderedDistance with collision awareness
    let currentCompactDist = starSize + 2; // Start after star with a small margin
    planets.forEach((p, idx) => {
        const margin = 1.5; // Gap between planet orbits
        if (idx > 0) {
            const prevPlanet = planets[idx - 1];
            // Distance = prev_dist + prev_radius + current_radius + margin
            currentCompactDist += prevPlanet.size + p.size + margin;
        } else {
            currentCompactDist += p.size + margin;
        }
        p.orderedDistance = currentCompactDist;
    });

    return {
        id: hostname.toLowerCase().replace(/\s+/g, '-'),
        name: hostname,
        discoveryYear: parseInt(first.disc_year) || null,
        coords: {
            ra: parseFloat(first.ra) || 0,
            dec: parseFloat(first.dec) || 0,
            dist: parseFloat(first.sy_dist) || 0
        },
        description: `The ${hostname} system, discovered in ${first.disc_year || 'unknown'}. Data from NASA Exoplanet Archive.`,
        star: {
            name: hostname,
            color: getStarColor(first.st_teff),
            size: starSize,
            texture: getAssetPath('textures/sun.png'),
            temperature: parseFloat(first.st_teff) || 5778,
            emissiveIntensity: 1.5,
        },
        planets
    };
};

const getSolarSystemData = () => {
    const planets = [
        { name: 'Mercury', radius: 0.383, period: 88, color: '#A5A5A5', texture: '/textures/2k_mercury.jpg', textureHD: '/textures/8k_mercury.jpg', axialTilt: 0.034, moons: [] },
        {
            name: 'Venus', radius: 0.949, period: 224.7, color: '#E3BB76', texture: '/textures/2k_venus_atmosphere.jpg', textureHD: '/textures/4k_venus_atmosphere.jpg', axialTilt: 177.4, moons: [] // Retrograde rotation
        },
        {
            name: 'Earth', radius: 1.0, period: 365.2, color: '#2233FF', texture: '/textures/2k_earth_daymap.jpg', textureHD: '/textures/8k_earth_daymap.jpg', axialTilt: 23.44,
            moons: [
                { name: 'Moon', size: 0.27, distance: 60.3, speed: 0.006, color: '#D1D1D1', texture: '/textures/2k_moon.jpg', textureHD: '/textures/8k_moon.jpg' }
            ]
        },
        {
            name: 'Mars', radius: 0.532, period: 687, color: '#E27B58', texture: '/textures/2k_mars.jpg', textureHD: '/textures/8k_mars.jpg', axialTilt: 25.19,
            moons: [
                { name: 'Phobos', size: 0.01, distance: 2.76, speed: 0.03, color: '#A19181' },
                { name: 'Deimos', size: 0.01, distance: 6.9, speed: 0.019, color: '#B1A191' }
            ]
        },
        {
            name: 'Ceres', radius: 0.074, period: 1682, color: '#A5A5A5', texture: '/textures/2k_ceres_fictional.jpg', textureHD: '/textures/4k_ceres_fictional.jpg', axialTilt: 4, isDwarf: true,
            description: 'The largest object in the main asteroid belt and the only dwarf planet in the inner solar system.',
            moons: []
        },
        {
            name: 'Jupiter', radius: 11.21, period: 4331, color: '#D39C7E', texture: '/textures/2k_jupiter.jpg', textureHD: '/textures/8k_jupiter.jpg', axialTilt: 3.13,
            moons: [
                { name: 'Metis', size: 0.01, distance: 1.79, speed: 0.037, color: '#A19181' },
                { name: 'Adrastea', size: 0.01, distance: 1.81, speed: 0.037, color: '#B1A191' },
                { name: 'Amalthea', size: 0.02, distance: 2.54, speed: 0.031, color: '#D18171' },
                { name: 'Thebe', size: 0.01, distance: 3.11, speed: 0.028, color: '#C19181' },
                { name: 'Io', size: 0.28, distance: 5.9, speed: 0.02, color: '#F3E346' },
                { name: 'Europa', size: 0.24, distance: 9.4, speed: 0.016, color: '#E1D1C1' },
                { name: 'Ganymede', size: 0.41, distance: 15.0, speed: 0.013, color: '#A19181' },
                { name: 'Callisto', size: 0.37, distance: 26.3, speed: 0.01, color: '#817161' }
            ]
        },
        {
            name: 'Saturn', radius: 9.45, period: 10747, color: '#C5AB6E', texture: '/textures/2k_saturn.jpg', textureHD: '/textures/8k_saturn.jpg', axialTilt: 26.73, rings: { inner: 1.2, outer: 2.3 },
            moons: [
                { name: 'Pan', size: 0.01, distance: 2.2, speed: 0.033, color: '#FFFFFF' },
                { name: 'Daphnis', size: 0.01, distance: 2.2, speed: 0.033, color: '#FFFFFF' },
                { name: 'Atlas', size: 0.01, distance: 2.3, speed: 0.032, color: '#FFFFFF' },
                { name: 'Prometheus', size: 0.02, distance: 2.3, speed: 0.032, color: '#D1D1D1' },
                { name: 'Pandora', size: 0.02, distance: 2.3, speed: 0.032, color: '#D1D1D1' },
                { name: 'Epimetheus', size: 0.02, distance: 2.5, speed: 0.031, color: '#C1C1C1' },
                { name: 'Janus', size: 0.02, distance: 2.5, speed: 0.031, color: '#C1C1C1' },
                { name: 'Mimas', size: 0.04, distance: 3.1, speed: 0.028, color: '#D1D1D1' },
                { name: 'Enceladus', size: 0.05, distance: 3.9, speed: 0.025, color: '#FFFFFF' },
                { name: 'Tethys', size: 0.08, distance: 4.9, speed: 0.022, color: '#E1E1E1' },
                { name: 'Dione', size: 0.09, distance: 6.3, speed: 0.02, color: '#D1D1D1' },
                { name: 'Rhea', size: 0.12, distance: 8.7, speed: 0.017, color: '#D1D1D1' },
                { name: 'Titan', size: 0.40, distance: 20.2, speed: 0.011, color: '#E3BB76' },
                { name: 'Hyperion', size: 0.03, distance: 24.5, speed: 0.01, color: '#C1B1A1' },
                { name: 'Iapetus', size: 0.11, distance: 59.0, speed: 0.006, color: '#D1D1D1' }
            ]
        },
        {
            name: 'Uranus', radius: 4.01, period: 30589, color: '#BBE1E4', texture: '/textures/2k_uranus.jpg', axialTilt: 97.77, rings: { inner: 1.1, outer: 1.5, color: '#FFFFFF', opacity: 0.3 }, // Extreme tilt!
            moons: [
                { name: 'Miranda', size: 0.04, distance: 5.1, speed: 0.022, color: '#D1D1D1' },
                { name: 'Ariel', size: 0.09, distance: 7.5, speed: 0.018, color: '#E1E1E1' },
                { name: 'Umbriel', size: 0.09, distance: 10.4, speed: 0.015, color: '#A1A1A1' },
                { name: 'Titania', size: 0.12, distance: 17.1, speed: 0.012, color: '#D1D1D1' },
                { name: 'Oberon', size: 0.11, distance: 22.9, speed: 0.01, color: '#C1B1A1' }
            ]
        },
        {
            name: 'Neptune', radius: 3.88, period: 59800, color: '#6081FF', texture: '/textures/2k_neptune.jpg', axialTilt: 28.32,
            moons: [
                { name: 'Triton', size: 0.21, distance: 14.3, speed: 0.013, color: '#E1D1D1' }
            ]
        },
        {
            name: 'Pluto', radius: 0.186, period: 90560, color: '#D1D1D1', axialTilt: 122.53, isDwarf: true, // Extreme tilt
            description: 'A dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune.',
            moons: [
                { name: 'Charon', size: 0.12, distance: 16.5, speed: 0.012, color: '#A1A1A1' },
                { name: 'Styx', size: 0.01, distance: 36.3, speed: 0.008, color: '#888888' },
                { name: 'Nix', size: 0.03, distance: 41.5, speed: 0.007, color: '#A1A1A1' },
                { name: 'Kerberos', size: 0.02, distance: 49.9, speed: 0.007, color: '#888888' },
                { name: 'Hydra', size: 0.04, distance: 55.4, speed: 0.006, color: '#A1A1A1' }
            ]
        },
        {
            name: 'Haumea', radius: 0.13, period: 103774, color: '#D1D1D1', texture: '/textures/2k_haumea_fictional.jpg', textureHD: '/textures/4k_haumea_fictional.jpg', axialTilt: 126, isDwarf: true,
            description: 'A dwarf planet in the Kuiper belt, known for its elongated shape and rapid rotation.',
            moons: [
                { name: 'Namaka', size: 0.04, distance: 32.0, speed: 0.009, color: '#A1A1A1' },
                { name: 'Hiʻiaka', size: 0.08, distance: 62.0, speed: 0.006, color: '#D1D1D1' }
            ]
        },
        {
            name: 'Makemake', radius: 0.11, period: 111400, color: '#D1A181', texture: '/textures/2k_makemake_fictional.jpg', textureHD: '/textures/4k_makemake_fictional.jpg', axialTilt: 0, isDwarf: true,
            description: 'A dwarf planet in the Kuiper belt and one of the largest known objects in the outer solar system.',
            moons: [
                { name: 'MK2', size: 0.03, distance: 29.0, speed: 0.009, color: '#888888' }
            ]
        },
        {
            name: 'Eris', radius: 0.18, period: 203600, color: '#E1E1E1', texture: '/textures/2k_eris_fictional.jpg', textureHD: '/textures/4k_eris_fictional.jpg', axialTilt: 78, isDwarf: true,
            description: 'One of the largest known dwarf planets in our solar system, located in the scattered disc.',
            moons: [
                { name: 'Dysnomia', size: 0.06, distance: 32.0, speed: 0.009, color: '#A1A1A1' }
            ]
        }
    ];

    const starSize = 3; // Sun is roughly 1 solar radius, scaled by 3 in our app
    const processedPlanets = planets.map((p, index) => {
        const actualDistance = Math.pow(p.period / 365.2, 2 / 3) * 50;
        const size = p.radius * 0.15;
        return {
            name: p.name,
            color: p.color,
            texture: p.texture ? getAssetPath(p.texture.replace(/^\//, '')) : undefined,
            textureHD: p.textureHD ? getAssetPath(p.textureHD.replace(/^\//, '')) : undefined,
            rings: p.rings,
            isDwarf: p.isDwarf,
            axialTilt: (p.axialTilt || 0) * (Math.PI / 180), // Convert degrees to radians
            moons: (p.moons || []).map(m => ({
                ...m,
                texture: m.texture ? getAssetPath(m.texture.replace(/^\//, '')) : undefined,
                textureHD: m.textureHD ? getAssetPath(m.textureHD.replace(/^\//, '')) : undefined,
                size: m.size * 0.15, // Scale moon size relative to planet scale
                distance: m.distance * size // Scale distance by planet size for precise ratios
            })),
            size,
            actualDistance,
            speed: 0.1 / p.period,
            description: p.description || `The ${p.name} of our Solar System. Orbital period: ${p.period} days.`,
            // Solar system planets are not procedural for now as they have textures
            isProcedural: false
        };
    });

    // Calculate orderedDistance with collision awareness
    let currentCompactDist = starSize + 2;
    processedPlanets.forEach((p, idx) => {
        const margin = 1.5;
        if (idx > 0) {
            const prevPlanet = processedPlanets[idx - 1];
            currentCompactDist += prevPlanet.size + p.size + margin;
        } else {
            currentCompactDist += p.size + margin;
        }
        p.orderedDistance = currentCompactDist;
    });

    // Define Asteroid Belts
    const belts = [
        {
            name: 'Main Asteroid Belt',
            innerRadius: processedPlanets.find(p => p.name === 'Mars').actualDistance + 5,
            outerRadius: processedPlanets.find(p => p.name === 'Jupiter').actualDistance - 10,
            count: 2000,
            color: '#888888'
        },
        {
            name: 'Kuiper Belt',
            innerRadius: processedPlanets.find(p => p.name === 'Neptune').actualDistance + 10,
            outerRadius: processedPlanets.find(p => p.name === 'Neptune').actualDistance + 60,
            count: 3000,
            color: '#666688'
        }
    ];

    // Add compact distances for belts
    belts[0].orderedInner = processedPlanets.find(p => p.name === 'Mars').orderedDistance + 1;
    belts[0].orderedOuter = processedPlanets.find(p => p.name === 'Ceres').orderedDistance + 1; // Main belt around Ceres

    // Adjust Ceres to be inside the belt
    const mars = processedPlanets.find(p => p.name === 'Mars');
    const jupiter = processedPlanets.find(p => p.name === 'Jupiter');
    const ceres = processedPlanets.find(p => p.name === 'Ceres');

    belts[0].orderedInner = mars.orderedDistance + 1;
    belts[0].orderedOuter = jupiter.orderedDistance - 1;

    belts[1].orderedInner = processedPlanets.find(p => p.name === 'Neptune').orderedDistance + 2;
    belts[1].orderedOuter = processedPlanets.find(p => p.name === 'Eris').orderedDistance + 5;

    return {
        id: 'solar-system',
        name: 'Solar System',
        discoveryYear: 0,
        coords: { ra: 0, dec: 0, dist: 0 },
        description: 'Our home system, featuring the Sun and eight planets.',
        star: {
            name: 'Sun',
            color: '#ffffff',
            size: starSize,
            texture: getAssetPath('textures/2k_sun.jpg'),
            temperature: 5778, // Sun's effective temperature in Kelvin
            emissiveIntensity: 1.5,
        },
        planets: processedPlanets,
        belts
    };
};

export const getInitialSystems = async () => {
    // Return Solar System synchronously - it's hardcoded and fast
    return [getSolarSystemData()];
};

// Load additional systems asynchronously - call this after initial render
export const loadAdditionalSystems = async (onSystemLoaded) => {
    const additionalHostnames = ['TRAPPIST-1', 'Kepler-186', 'Proxima Cen'];

    for (const hostname of additionalHostnames) {
        try {
            const data = await fetchSystemData(hostname);
            if (data && onSystemLoaded) {
                onSystemLoaded(data);
            }
        } catch (error) {
            console.warn(`Could not load system ${hostname}:`, error);
        }
    }
};

// Get all systems with their galactic positions for the 3D map
// Uses scaled coordinates for better visualization (actual distances range from 1pc to 8000pc+)
export const getAllSystemsForGalacticMap = async () => {
    const catalog = await initCatalog();
    const systemsMap = new Map();

    catalog.forEach(item => {
        if (!systemsMap.has(item.hostname)) {
            const starTemp = parseFloat(item.st_teff);
            const ra = parseFloat(item.ra) || 0;
            const dec = parseFloat(item.dec) || 0;
            const dist = parseFloat(item.sy_dist) || 100;

            // Convert RA/Dec/Distance to 3D Cartesian coordinates
            // Scale distance logarithmically for better visualization
            // Actual distances range from ~1pc to 8000pc, scale to 10-500 range
            const scaledDist = 10 + Math.log10(Math.max(1, dist)) * 120;
            const raRad = ra * (Math.PI / 180);
            const decRad = dec * (Math.PI / 180);

            systemsMap.set(item.hostname, {
                hostname: item.hostname,
                planetCount: 0,
                starTemp: starTemp || null,
                starType: getStarType(starTemp),
                starColor: getStarIndicatorColor(starTemp),
                // Celestial coordinates
                ra, dec, distance: dist,
                // 3D position (scaled for visualization)
                position: {
                    x: scaledDist * Math.cos(decRad) * Math.cos(raRad),
                    y: scaledDist * Math.sin(decRad),
                    z: scaledDist * Math.cos(decRad) * Math.sin(raRad)
                }
            });
        }
        systemsMap.get(item.hostname).planetCount++;
    });

    return Array.from(systemsMap.values());
};

const getRandomPlanetColor = (index) => {
    const colors = ['#A5A5A5', '#E3BB76', '#2233FF', '#E27B58', '#D39C7E', '#C5AB6E', '#BBE1E4', '#6081FF'];
    return colors[index % colors.length];
};

