#include <common>
#include <logdepthbuf_pars_fragment>

uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uEmissiveIntensity;
uniform float uIsSun;
uniform float uTime;
uniform float uSurfaceActivity;
uniform float uStarType; // 0-6 for O→M

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

// Simplex noise for surface granulation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    #include <logdepthbuf_fragment>
    
    vec4 texColor = texture2D(uMap, vUv);
    
    // Convert texture to grayscale to remove original yellow tint
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Enhance contrast of the texture for better star surface look
    gray = pow(gray, 1.2) * 1.5;
    
    // Surface granulation/convection pattern
    float granulationScale = 8.0 + uStarType * 2.0; // More granulation for cooler stars
    float granulation = snoise(vUv * granulationScale + uTime * 0.05) * 0.5 + 0.5;
    granulation = mix(1.0, granulation, uSurfaceActivity * 0.3);
    
    // Surface turbulence (more active for M-type stars)
    float turbulence = snoise(vUv * 4.0 + uTime * 0.1) * 0.5 + 0.5;
    float turbulenceStrength = uSurfaceActivity * 0.15;
    
    // Flare activity for active stars (K and M types)
    float flareNoise = snoise(vUv * 12.0 + uTime * 0.3);
    float flare = 0.0;
    if (uStarType >= 5.0 && flareNoise > 0.7) {
        flare = (flareNoise - 0.7) * 2.0 * uSurfaceActivity;
    }
    
    vec3 baseColor;
    if (uIsSun > 0.5) {
        // For the Sun, use the original texture colors but allow emissive boost
        baseColor = texColor.rgb * uEmissiveIntensity;
    } else {
        // For other stars, apply the target star color to the grayscale texture
        baseColor = uColor * gray * uEmissiveIntensity;
    }
    
    // Apply granulation and turbulence
    baseColor *= granulation;
    baseColor += baseColor * turbulence * turbulenceStrength;
    
    // Limb darkening (stars are darker at the edges)
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float dotNV = max(dot(vNormal, viewDir), 0.0);
    
    // Limb darkening varies by star type (cooler stars have more)
    float limbDarkeningPower = 0.3 + uStarType * 0.05;
    float limbDarkening = pow(dotNV, limbDarkeningPower);
    
    // Add a slight core glow (brighter in the center)
    vec3 finalColor = baseColor * (0.7 + 0.5 * limbDarkening);
    
    // Add flare brightness for active stars
    finalColor += uColor * flare * 0.5;
    
    // Add a subtle atmospheric glow at the very edge
    float rim = pow(1.0 - dotNV, 6.0);
    finalColor += uColor * rim * 0.4;
    
    // Color temperature variation (hotter stars have slight blue core, cooler have red edge)
    if (uStarType <= 2.0) {
        // Hot stars: slightly bluer in center
        finalColor += vec3(0.0, 0.0, 0.1) * limbDarkening;
    } else if (uStarType >= 5.0) {
        // Cool stars: redder at edges
        finalColor += vec3(0.15, 0.0, 0.0) * (1.0 - limbDarkening);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}
