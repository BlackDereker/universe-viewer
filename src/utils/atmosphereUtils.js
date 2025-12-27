export const estimateAtmosphere = (planet, details) => {
    // If we have explicit data, use it
    if (details?.atmosphere) return details.atmosphere;

    // Fallback estimation for exoplanets or missing solar system data
    const type = planet.planetType || details?.type?.toLowerCase() || 'rocky';
    const temp = planet.temperature || details?.avgTempC || 0;

    if (type === 'gas' || type.includes('giant')) {
        // Most gas giants are hydrogen/helium dominated
        return { H2: 90, He: 10 };
    }

    if (type === 'ice giant') {
        return { H2: 80, He: 18, CH4: 2 };
    }

    if (type === 'super-earth' || type === 'rocky') {
        if (temp > 600) {
            // Hot rocky planets often have CO2 or SO2 atmospheres
            return { CO2: 95, N2: 4, SO2: 1 };
        } else if (temp > 250 && temp < 350) {
            // Earth-like temp range
            return { N2: 78, O2: 21, Ar: 1 };
        } else if (temp < 100) {
            // Very cold - thin nitrogen/methane (like Pluto)
            return { N2: 99, CH4: 0.5, CO: 0.5 };
        } else {
            // General rocky fallback (CO2 dominated like Mars/Venus)
            return { CO2: 95, N2: 3, Ar: 2 };
        }
    }

    return null;
};

export const getAtmosphereDescription = (planet, details) => {
    if (details?.atmosphereDesc) return details.atmosphereDesc;

    const type = planet.planetType || details?.type?.toLowerCase() || 'rocky';
    const temp = planet.temperature || details?.avgTempC || 0;

    if (type === 'gas') return "Thick hydrogen-helium atmosphere characteristic of gas giants.";
    if (type === 'super-earth') return "Scientists estimate a dense atmosphere, possibly rich in volatiles.";
    if (type === 'rocky') {
        if (temp > 600) return "Extremely hot, potentially toxic atmosphere with heavy greenhouse effects.";
        if (temp > 250 && temp < 350) return "Potentially life-supporting atmosphere with balanced nitrogen and oxygen.";
        return "Thin, freezing atmosphere primarily composed of inert gases.";
    }

    return "Atmospheric composition estimated based on planetary mass and temperature.";
};
