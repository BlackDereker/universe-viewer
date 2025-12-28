// Stellar classification data based on spectral types
// Morgan-Keenan spectral classification: O, B, A, F, G, K, M

export const SPECTRAL_TYPES = {
    O: {
        name: 'O-type',
        description: 'Blue supergiant - extremely hot and luminous',
        tempRange: [30000, 60000],
        color: '#9bb0ff',
        sizeMultiplier: 3.0,
        luminosityClass: 'Supergiant',
        surfaceActivity: 0.3,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Strong stellar wind', 'UV radiation', 'Very rare']
    },
    B: {
        name: 'B-type',
        description: 'Blue-white giant - hot and bright',
        tempRange: [10000, 30000],
        color: '#aabfff',
        sizeMultiplier: 2.5,
        luminosityClass: 'Giant',
        surfaceActivity: 0.4,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Hot surface', 'Blue-white glow', 'Young stars']
    },
    A: {
        name: 'A-type',
        description: 'White star - common bright stars',
        tempRange: [7500, 10000],
        color: '#cad7ff',
        sizeMultiplier: 1.8,
        luminosityClass: 'Main Sequence',
        surfaceActivity: 0.2,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Strong hydrogen lines', 'White appearance', 'Sirius, Vega']
    },
    F: {
        name: 'F-type',
        description: 'Yellow-white star - slightly hotter than Sun',
        tempRange: [6000, 7500],
        color: '#f8f7ff',
        sizeMultiplier: 1.3,
        luminosityClass: 'Main Sequence',
        surfaceActivity: 0.5,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Moderate activity', 'Good for habitability', 'Procyon']
    },
    G: {
        name: 'G-type',
        description: 'Yellow dwarf - Sun-like stars',
        tempRange: [5200, 6000],
        color: '#fff4ea',
        sizeMultiplier: 1.0,
        luminosityClass: 'Main Sequence',
        surfaceActivity: 0.6,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Sun-like', 'Best for life', 'Stable output']
    },
    K: {
        name: 'K-type',
        description: 'Orange dwarf - cooler and longer-lived',
        tempRange: [3700, 5200],
        color: '#ffd2a1',
        sizeMultiplier: 0.8,
        luminosityClass: 'Main Sequence',
        surfaceActivity: 0.7,
        pulsationPeriod: 0,
        pulsationAmplitude: 0,
        characteristics: ['Long-lived', 'Good habitability', 'Alpha Centauri B']
    },
    M: {
        name: 'M-type',
        description: 'Red dwarf - cool, small, and common',
        tempRange: [2400, 3700],
        color: '#ffb56c',
        sizeMultiplier: 0.5,
        luminosityClass: 'Main Sequence',
        surfaceActivity: 0.9,
        pulsationPeriod: 2.0,
        pulsationAmplitude: 0.05,
        characteristics: ['Most common', 'Stellar flares', 'Proxima Centauri']
    }
};

// Get spectral type from temperature
export const getSpectralType = (temperature) => {
    if (!temperature || isNaN(temperature)) return SPECTRAL_TYPES.G;
    if (temperature >= 30000) return SPECTRAL_TYPES.O;
    if (temperature >= 10000) return SPECTRAL_TYPES.B;
    if (temperature >= 7500) return SPECTRAL_TYPES.A;
    if (temperature >= 6000) return SPECTRAL_TYPES.F;
    if (temperature >= 5200) return SPECTRAL_TYPES.G;
    if (temperature >= 3700) return SPECTRAL_TYPES.K;
    return SPECTRAL_TYPES.M;
};

// Get spectral type index (0-6) for shader
export const getSpectralTypeIndex = (temperature) => {
    if (!temperature || isNaN(temperature)) return 4; // G-type default
    if (temperature >= 30000) return 0; // O
    if (temperature >= 10000) return 1; // B
    if (temperature >= 7500) return 2;  // A
    if (temperature >= 6000) return 3;  // F
    if (temperature >= 5200) return 4;  // G
    if (temperature >= 3700) return 5;  // K
    return 6; // M
};

// Get star size multiplier based on temperature
export const getStarSizeMultiplier = (temperature) => {
    const type = getSpectralType(temperature);
    return type.sizeMultiplier;
};

// Get star color based on temperature (more accurate than simple mapping)
export const getStarColor = (temperature) => {
    const type = getSpectralType(temperature);
    return type.color;
};
