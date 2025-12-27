// Detailed planet data for Solar System planets
export const planetDetails = {
    Mercury: {
        type: 'Terrestrial',
        mass: '3.285 × 10²³ kg',
        diameter: '4,879 km',
        gravity: '3.7 m/s²',
        dayLength: '59 Earth days',
        yearLength: '88 Earth days',
        distanceFromSun: '57.9 million km',
        avgTemperature: '167°C (day) / -183°C (night)',
        atmosphere: null,
        atmosphereDesc: 'No significant atmosphere',
        surfaceFeatures: ['Heavily cratered', 'Caloris Basin', 'Scarps and ridges'],
        funFacts: [
            'Smallest planet in our solar system',
            'Has the most extreme temperature swings',
            'One day on Mercury is longer than its year'
        ],
        discoveredBy: 'Known since antiquity',
        missions: [
            { name: 'Mariner 10', year: 1974, type: 'Flyby', finding: 'First mission to visit Mercury and mapped 45% of the surface.' },
            { name: 'MESSENGER', year: 2004, type: 'Orbiter', finding: 'Found evidence of water ice in permanently shadowed polar craters.' },
            { name: 'BepiColombo', year: 2018, type: 'Orbiter', finding: 'International mission currently en route to study Mercury\'s composition and magnetic field.' }
        ],
        // Numeric values for comparison
        diameterKm: 4879,
        massEarths: 0.055,
        gravityMs2: 3.7,
        avgTempC: -8,
        distanceFromSunAU: 0.39,
        dayLengthHours: 1416,
        yearLengthDays: 88
    },
    Venus: {
        type: 'Terrestrial',
        mass: '4.867 × 10²⁴ kg',
        diameter: '12,104 km',
        gravity: '8.87 m/s²',
        dayLength: '243 Earth days',
        yearLength: '225 Earth days',
        distanceFromSun: '108.2 million km',
        avgTemperature: '464°C',
        atmosphere: { CO2: 96.5, N2: 3.5, SO2: 0.015 },
        atmosphereDesc: 'Thick, toxic atmosphere with sulfuric acid clouds',
        surfaceFeatures: ['Volcanic plains', 'Mountain ranges', 'Lava flows'],
        funFacts: [
            'Hottest planet in our solar system',
            'Rotates backwards (retrograde)',
            'Day is longer than its year'
        ],
        discoveredBy: 'Known since antiquity',
        missions: [
            { name: 'Venera 7', year: 1970, type: 'Lander', finding: 'First spacecraft to successfully land on another planet and transmit data back to Earth.' },
            { name: 'Magellan', year: 1989, type: 'Orbiter', finding: 'Mapped 98% of the surface using radar, revealing dynamic volcanic geology.' },
            { name: 'Venus Express', year: 2005, type: 'Orbiter', finding: 'Studied the complex atmosphere and confirmed lightning occurs on Venus.' }
        ],
        // Numeric values for comparison
        diameterKm: 12104,
        massEarths: 0.815,
        gravityMs2: 8.87,
        avgTempC: 464,
        distanceFromSunAU: 0.72,
        dayLengthHours: 5832,
        yearLengthDays: 225
    },
    Earth: {
        type: 'Terrestrial',
        mass: '5.972 × 10²⁴ kg',
        diameter: '12,742 km',
        gravity: '9.81 m/s²',
        dayLength: '24 hours',
        yearLength: '365.25 days',
        distanceFromSun: '149.6 million km',
        avgTemperature: '15°C',
        atmosphere: { N2: 78, O2: 21, Ar: 0.93, CO2: 0.04 },
        atmosphereDesc: 'Nitrogen-oxygen atmosphere supporting life',
        surfaceFeatures: ['Oceans (71%)', 'Continents', 'Mountains', 'Forests'],
        funFacts: [
            'Only known planet with life',
            'Has a powerful magnetic field',
            '70% of surface is water'
        ],
        discoveredBy: null,
        missions: [
            { name: 'Explorer 1', year: 1958, type: 'Satellite', finding: 'Discovered the Van Allen radiation belts surrounding Earth.' },
            { name: 'Landsat 1', year: 1972, type: 'Satellite', finding: 'The first satellite dedicated to monitoring Earth\'s land surface.' },
            { name: 'ISS', year: 1998, type: 'Space Station', finding: 'Permanently inhabited laboratory for research in microgravity.' }
        ],
        // Numeric values for comparison
        diameterKm: 12742,
        massEarths: 1.0,
        gravityMs2: 9.81,
        avgTempC: 15,
        distanceFromSunAU: 1.0,
        dayLengthHours: 24,
        yearLengthDays: 365.25
    },
    Moon: {
        type: 'Moon (Natural Satellite)',
        mass: '7.342 × 10²² kg',
        diameter: '3,474 km',
        gravity: '1.62 m/s²',
        dayLength: '27.3 Earth days',
        yearLength: null,
        distanceFromSun: null,
        distanceFromPlanet: '384,400 km',
        avgTemperature: '127°C (day) / -173°C (night)',
        atmosphere: null,
        atmosphereDesc: 'No atmosphere (exosphere only)',
        surfaceFeatures: ['Maria (dark plains)', 'Craters', 'Highlands'],
        funFacts: [
            'Only celestial body humans have visited',
            'Tidally locked to Earth',
            'Slowly drifting away from Earth'
        ],
        discoveredBy: 'Known since antiquity',
        missions: [
            { name: 'Luna 2', year: 1959, type: 'Impactor', finding: 'First human-made object to reach the surface of the Moon.' },
            { name: 'Apollo 11', year: 1969, type: 'Manned Landing', finding: 'First humans walked on the Moon and returned 21.5kg of lunar material.' },
            { name: 'LRO', year: 2009, type: 'Orbiter', finding: 'Found evidence of frozen water in permanently shadowed craters.' }
        ],
        // Numeric values for comparison
        diameterKm: 3474,
        massEarths: 0.0123,
        gravityMs2: 1.62,
        avgTempC: -23,
        distanceFromSunAU: 1.0,
        dayLengthHours: 655.2,
        yearLengthDays: null
    },
    Mars: {
        type: 'Terrestrial',
        mass: '6.39 × 10²³ kg',
        diameter: '6,779 km',
        gravity: '3.71 m/s²',
        dayLength: '24.6 hours',
        yearLength: '687 Earth days',
        distanceFromSun: '227.9 million km',
        avgTemperature: '-65°C',
        atmosphere: { CO2: 95.3, N2: 2.7, Ar: 1.6, O2: 0.13 },
        atmosphereDesc: 'Thin CO₂ atmosphere, 1% of Earth\'s pressure',
        surfaceFeatures: ['Olympus Mons', 'Valles Marineris', 'Polar ice caps'],
        funFacts: [
            'Has the tallest volcano in the solar system',
            'Evidence of ancient water',
            'Two small moons: Phobos and Deimos'
        ],
        discoveredBy: 'Known since antiquity',
        missions: [
            { name: 'Viking 1', year: 1975, type: 'Lander', finding: 'Conducted the first successful long-duration stay on the Martian surface.' },
            { name: 'Mars Pathfinder', year: 1996, type: 'Rover', finding: 'Demonstrated that roving on Mars was possible with the Sojourner rover.' },
            { name: 'Curiosity', year: 2011, type: 'Rover', finding: 'Confirmed that Mars once had the chemical and environmental conditions to support microbial life.' },
            { name: 'Perseverance', year: 2020, type: 'Rover', finding: 'Collecting samples from an ancient river delta to search for signs of past life.' }
        ],
        // Numeric values for comparison
        diameterKm: 6779,
        massEarths: 0.107,
        gravityMs2: 3.71,
        avgTempC: -65,
        distanceFromSunAU: 1.52,
        dayLengthHours: 24.6,
        yearLengthDays: 687
    },
    Ceres: {
        type: 'Dwarf Planet',
        mass: '9.39 × 10²⁰ kg',
        diameter: '946 km',
        gravity: '0.28 m/s²',
        dayLength: '9.1 hours',
        yearLength: '4.6 Earth years',
        distanceFromSun: '413.9 million km',
        avgTemperature: '-105°C',
        atmosphere: null,
        atmosphereDesc: 'Transient water vapor detected',
        surfaceFeatures: ['Occator Crater', 'Bright salt deposits', 'Ice deposits'],
        funFacts: [
            'Largest object in the asteroid belt',
            'Contains about 25% water ice',
            'Reclassified as dwarf planet in 2006'
        ],
        discoveredBy: 'Giuseppe Piazzi (1801)',
        missions: [
            { name: 'Dawn', year: 2007, type: 'Orbiter', finding: 'Detailed study of Ceres revealed it to be a world of water-rich minerals and curious bright salty spots.' }
        ],
        // Numeric values for comparison
        diameterKm: 946,
        massEarths: 0.00016,
        gravityMs2: 0.28,
        avgTempC: -105,
        distanceFromSunAU: 2.77,
        dayLengthHours: 9.1,
        yearLengthDays: 1680
    },
    Jupiter: {
        type: 'Gas Giant',
        mass: '1.898 × 10²⁷ kg',
        diameter: '139,820 km',
        gravity: '24.79 m/s²',
        dayLength: '9.9 hours',
        yearLength: '11.9 Earth years',
        distanceFromSun: '778.5 million km',
        avgTemperature: '-110°C',
        atmosphere: { H2: 89.8, He: 10.2 },
        atmosphereDesc: 'Hydrogen-helium atmosphere with colorful cloud bands',
        surfaceFeatures: ['Great Red Spot', 'Cloud bands', 'Faint ring system'],
        funFacts: [
            'Largest planet in our solar system',
            'Great Red Spot is a 400-year-old storm',
            'Has at least 95 known moons'
        ],
        discoveredBy: 'Known since antiquity',
        missions: [
            { name: 'Pioneer 10', year: 1972, type: 'Flyby', finding: 'First spacecraft to pass through the asteroid belt and visit Jupiter.' },
            { name: 'Voyager 1', year: 1977, type: 'Flyby', finding: 'Discovered Jupiter\'s rings and volcanic activity on the moon Io.' },
            { name: 'Galileo', year: 1989, type: 'Orbiter', finding: 'First to orbit a gas giant; discovered an ocean under Europa\'s ice.' },
            { name: 'Juno', year: 2011, type: 'Orbiter', finding: 'Revealed a large "fuzzy" core and spectacular deep lightning in the atmosphere.' }
        ],
        // Numeric values for comparison
        diameterKm: 139820,
        massEarths: 317.8,
        gravityMs2: 24.79,
        avgTempC: -110,
        distanceFromSunAU: 5.2,
        dayLengthHours: 9.9,
        yearLengthDays: 4333
    },
    Saturn: {
        type: 'Gas Giant',
        mass: '5.683 × 10²⁶ kg',
        diameter: '116,460 km',
        gravity: '10.44 m/s²',
        dayLength: '10.7 hours',
        yearLength: '29.4 Earth years',
        distanceFromSun: '1.43 billion km',
        avgTemperature: '-140°C',
        atmosphere: { H2: 96.3, He: 3.25 },
        atmosphereDesc: 'Hydrogen-helium atmosphere with ammonia clouds',
        surfaceFeatures: ['Spectacular ring system', 'Hexagonal polar storm', 'Cloud bands'],
        funFacts: [
            'Most extensive ring system',
            'Less dense than water',
            'Has 146+ known moons including Titan'
        ],
        discoveredBy: 'Known since antiquity (rings by Galileo 1610)',
        missions: [
            { name: 'Pioneer 11', year: 1973, type: 'Flyby', finding: 'First mission to Saturn; discovered the narrow F ring.' },
            { name: 'Voyager 2', year: 1977, type: 'Flyby', finding: 'Mapped the moons in detail and studied the complex ring structures.' },
            { name: 'Cassini', year: 1997, type: 'Orbiter', finding: '13-year mission discovered plumes on Enceladus and methane lakes on Titan.' }
        ],
        // Numeric values for comparison
        diameterKm: 116460,
        massEarths: 95.2,
        gravityMs2: 10.44,
        avgTempC: -140,
        distanceFromSunAU: 9.58,
        dayLengthHours: 10.7,
        yearLengthDays: 10759
    },
    Uranus: {
        type: 'Ice Giant',
        mass: '8.681 × 10²⁵ kg',
        diameter: '50,724 km',
        gravity: '8.87 m/s²',
        dayLength: '17.2 hours',
        yearLength: '84 Earth years',
        distanceFromSun: '2.87 billion km',
        avgTemperature: '-195°C',
        atmosphere: { H2: 82.5, He: 15.2, CH4: 2.3 },
        atmosphereDesc: 'Hydrogen-helium with methane giving blue color',
        surfaceFeatures: ['Faint ring system', 'Extreme axial tilt', 'Featureless appearance'],
        funFacts: [
            'Tilted 98° on its side',
            'Coldest planetary atmosphere',
            'Rotates in retrograde direction'
        ],
        discoveredBy: 'William Herschel (1781)',
        missions: [
            { name: 'Voyager 2', year: 1977, type: 'Flyby', finding: 'The only spacecraft to visit Uranus, discovering 10 new moons and two rings.' }
        ],
        // Numeric values for comparison
        diameterKm: 50724,
        massEarths: 14.5,
        gravityMs2: 8.87,
        avgTempC: -195,
        distanceFromSunAU: 19.22,
        dayLengthHours: 17.2,
        yearLengthDays: 30687
    },
    Neptune: {
        type: 'Ice Giant',
        mass: '1.024 × 10²⁶ kg',
        diameter: '49,528 km',
        gravity: '11.15 m/s²',
        dayLength: '16.1 hours',
        yearLength: '165 Earth years',
        distanceFromSun: '4.5 billion km',
        avgTemperature: '-200°C',
        atmosphere: { H2: 80, He: 19, CH4: 1 },
        atmosphereDesc: 'Hydrogen-helium with methane creating deep blue color',
        surfaceFeatures: ['Great Dark Spot', 'Fastest winds in solar system', 'Faint rings'],
        funFacts: [
            'Strongest winds of any planet (2,100 km/h)',
            'Has 14 known moons',
            'Triton orbits backwards'
        ],
        discoveredBy: 'Johann Galle (1846)',
        missions: [
            { name: 'Voyager 2', year: 1977, type: 'Flyby', finding: 'Discovered the Great Dark Spot and geysers on the moon Triton.' }
        ],
        // Numeric values for comparison
        diameterKm: 49528,
        massEarths: 17.1,
        gravityMs2: 11.15,
        avgTempC: -200,
        distanceFromSunAU: 30.05,
        dayLengthHours: 16.1,
        yearLengthDays: 60190
    },
    Pluto: {
        type: 'Dwarf Planet',
        mass: '1.303 × 10²² kg',
        diameter: '2,377 km',
        gravity: '0.62 m/s²',
        dayLength: '6.4 Earth days',
        yearLength: '248 Earth years',
        distanceFromSun: '5.9 billion km',
        avgTemperature: '-230°C',
        atmosphere: { N2: 99, CH4: 0.5, CO: 0.5 },
        atmosphereDesc: 'Thin nitrogen atmosphere that freezes when far from Sun',
        surfaceFeatures: ['Heart-shaped glacier (Sputnik Planitia)', 'Mountains', 'Nitrogen ice'],
        funFacts: [
            'Reclassified as dwarf planet in 2006',
            'Has 5 known moons',
            'Smaller than Earth\'s Moon'
        ],
        discoveredBy: 'Clyde Tombaugh (1930)',
        missions: [
            { name: 'New Horizons', year: 2006, type: 'Flyby', finding: 'Revealed Pluto to be a geologically active world with ice mountains and nitrogen glaciers.' }
        ],
        // Numeric values for comparison
        diameterKm: 2377,
        massEarths: 0.0022,
        gravityMs2: 0.62,
        avgTempC: -230,
        distanceFromSunAU: 39.5,
        dayLengthHours: 153.3,
        yearLengthDays: 90560
    },
    Eris: {
        type: 'Dwarf Planet',
        mass: '1.66 × 10²² kg',
        diameter: '2,326 km',
        gravity: '0.82 m/s²',
        dayLength: '25.9 hours',
        yearLength: '559 Earth years',
        distanceFromSun: '10.1 billion km',
        avgTemperature: '-243°C',
        atmosphere: null,
        atmosphereDesc: 'Possibly thin methane atmosphere when closest to Sun',
        surfaceFeatures: ['Highly reflective surface', 'Methane ice', 'Nitrogen ice'],
        funFacts: [
            'Most massive dwarf planet known',
            'Discovery led to Pluto\'s reclassification',
            'Has one known moon: Dysnomia'
        ],
        discoveredBy: 'Mike Brown, Chad Trujillo, David Rabinowitz (2005)',
        missions: [],
        // Numeric values for comparison
        diameterKm: 2326,
        massEarths: 0.0028,
        gravityMs2: 0.82,
        avgTempC: -243,
        distanceFromSunAU: 67.7,
        dayLengthHours: 25.9,
        yearLengthDays: 204199
    },
    Haumea: {
        type: 'Dwarf Planet',
        mass: '4.01 × 10²¹ kg',
        diameter: '1,632 km (mean)',
        gravity: '0.44 m/s²',
        dayLength: '3.9 hours',
        yearLength: '284 Earth years',
        distanceFromSun: '6.5 billion km',
        avgTemperature: '-241°C',
        atmosphere: null,
        atmosphereDesc: 'No significant atmosphere',
        surfaceFeatures: ['Elongated shape', 'Crystalline water ice', 'Dark red spot'],
        funFacts: [
            'Fastest spinning large object in the solar system',
            'Shaped like an elongated ellipsoid',
            'Has a ring system and two moons'
        ],
        discoveredBy: 'Mike Brown, Chad Trujillo (2004)',
        missions: [],
        // Numeric values for comparison
        diameterKm: 1632,
        massEarths: 0.00067,
        gravityMs2: 0.44,
        avgTempC: -241,
        distanceFromSunAU: 43.3,
        dayLengthHours: 3.9,
        yearLengthDays: 103774
    },
    Makemake: {
        type: 'Dwarf Planet',
        mass: '3.1 × 10²¹ kg',
        diameter: '1,430 km',
        gravity: '0.50 m/s²',
        dayLength: '22.5 hours',
        yearLength: '305 Earth years',
        distanceFromSun: '6.8 billion km',
        avgTemperature: '-243°C',
        atmosphere: null,
        atmosphereDesc: 'Possible thin nitrogen atmosphere',
        surfaceFeatures: ['Methane ice', 'Ethane ice', 'Reddish-brown color'],
        funFacts: [
            'Second brightest Kuiper belt object after Pluto',
            'Named after Rapanui creator god',
            'Has one known moon: MK2'
        ],
        discoveredBy: 'Mike Brown, Chad Trujillo, David Rabinowitz (2005)',
        missions: [],
        // Numeric values for comparison
        diameterKm: 1430,
        massEarths: 0.00052,
        gravityMs2: 0.50,
        avgTempC: -243,
        distanceFromSunAU: 45.8,
        dayLengthHours: 22.5,
        yearLengthDays: 111400
    }
};

export default planetDetails;
