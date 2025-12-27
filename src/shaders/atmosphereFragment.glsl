uniform vec3 uLightPos;
uniform vec3 uAtmosphereColor;
uniform float uAtmosphereDensity;
uniform float uAtmosphereStrength;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 lightDir = normalize(uLightPos - vWorldPosition);
    vec3 normal = normalize(vNormal); // This is the inward-facing normal for BackSide

    // For BackSide, the "outer" edge is where dot(normal, viewDir) is near 0
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);
    
    // Rayleigh scattering: bright ring when light is behind the planet
    float backlighting = pow(max(0.0, dot(lightDir, -viewDir)), 4.0);
    
    // Mie scattering: intense glow when looking near the star
    float mie = pow(max(0.0, dot(lightDir, -viewDir)), 20.0);

    // Sunset effect: light hitting the atmosphere at an angle
    // We use the dot product of the light and the view to determine if we're in the "sunset" zone
    float sunsetZone = pow(1.0 - max(0.0, dot(lightDir, -viewDir)), 2.0);
    vec3 sunsetColor = vec3(1.0, 0.5, 0.2);
    
    vec3 baseAtmosphere = uAtmosphereColor;
    
    // Mix in sunset colors based on the angle to the light
    vec3 scatteringColor = mix(baseAtmosphere, sunsetColor, sunsetZone * 0.5);
    
    // Final intensity combines fresnel (the ring shape) with the scattering logic
    float finalIntensity = fresnel * uAtmosphereStrength;
    
    // Add extra glow for backlighting (the "halo" when looking at the dark side)
    // Reduced for a more subtle, realistic look
    finalIntensity += backlighting * fresnel * 0.4;
    
    // Add Mie glow (intense spot near the star)
    // Reduced to prevent "blinding" effects with bloom
    vec3 finalColor = scatteringColor * finalIntensity + (vec3(1.0, 0.9, 0.8) * mie * fresnel * 0.6);

    // Subtle fade on the side directly opposite the star
    float darkSideFade = smoothstep(-0.4, 0.1, dot(lightDir, -viewDir));
    finalColor *= darkSideFade;

    gl_FragColor = vec4(finalColor, fresnel * 0.5 + backlighting * 0.5);
}
