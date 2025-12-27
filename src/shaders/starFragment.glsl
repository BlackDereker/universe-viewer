#include <common>
#include <logdepthbuf_pars_fragment>

uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uEmissiveIntensity;
uniform float uIsSun;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    #include <logdepthbuf_fragment>
    
    vec4 texColor = texture2D(uMap, vUv);
    
    // Convert texture to grayscale to remove original yellow tint
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Enhance contrast of the texture for better star surface look
    gray = pow(gray, 1.2) * 1.5;
    
    vec3 baseColor;
    if (uIsSun > 0.5) {
        // For the Sun, use the original texture colors but allow emissive boost
        baseColor = texColor.rgb * uEmissiveIntensity;
    } else {
        // For other stars, apply the target star color to the grayscale texture
        baseColor = uColor * gray * uEmissiveIntensity;
    }
    
    // Limb darkening (stars are darker at the edges)
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float dotNV = max(dot(vNormal, viewDir), 0.0);
    float limbDarkening = pow(dotNV, 0.4); // Subtle darkening at edges
    
    // Add a slight core glow (brighter in the center)
    vec3 finalColor = baseColor * (0.8 + 0.4 * limbDarkening);
    
    // Add a very subtle atmospheric glow at the very edge
    float rim = pow(1.0 - dotNV, 8.0);
    finalColor += uColor * rim * 0.3;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
