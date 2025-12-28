import i18n from '../i18n';

// Map of English planet/body names to translation keys
const SOLAR_SYSTEM_NAMES = {
    'Solar System': 'solarSystem.name',
    'Sun': 'solarSystem.sun',
    'Mercury': 'solarSystem.mercury',
    'Venus': 'solarSystem.venus',
    'Earth': 'solarSystem.earth',
    'Moon': 'solarSystem.moon',
    'Mars': 'solarSystem.mars',
    'Ceres': 'solarSystem.ceres',
    'Jupiter': 'solarSystem.jupiter',
    'Saturn': 'solarSystem.saturn',
    'Uranus': 'solarSystem.uranus',
    'Neptune': 'solarSystem.neptune',
    'Pluto': 'solarSystem.pluto',
    'Haumea': 'solarSystem.haumea',
    'Makemake': 'solarSystem.makemake',
    'Eris': 'solarSystem.eris'
};

// Translate a celestial body name if it's a Solar System body
export const translateName = (name) => {
    const key = SOLAR_SYSTEM_NAMES[name];
    if (key) {
        return i18n.t(key);
    }
    // Return original name for exoplanets and other systems
    return name;
};

// Check if a name is a Solar System body
export const isSolarSystemBody = (name) => {
    return name in SOLAR_SYSTEM_NAMES;
};
