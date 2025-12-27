#include <common>
#include <logdepthbuf_pars_fragment>

uniform vec3 uColor;
uniform float uInnerRadius;
uniform float uOuterRadius;
uniform float uOpacity;

varying float vRadius;

void main() {
    #include <logdepthbuf_fragment>
    
    // Calculate normalized position within the zone (0 = inner edge, 1 = outer edge)
    float zoneWidth = uOuterRadius - uInnerRadius;
    float normalizedPos = (vRadius - uInnerRadius) / zoneWidth;
    
    // Create smooth fade at both edges
    float fadeWidth = 0.25; // 25% fade zone on each edge
    
    // Inner edge fade (0 at edge, 1 when past fade zone)
    float innerFade = smoothstep(0.0, fadeWidth, normalizedPos);
    
    // Outer edge fade (1 when before fade zone, 0 at edge)
    float outerFade = smoothstep(1.0, 1.0 - fadeWidth, normalizedPos);
    
    // Combine fades
    float alpha = innerFade * outerFade * uOpacity;
    
    // Add subtle radial gradient for more depth
    float centerBrightness = 1.0 - abs(normalizedPos - 0.5) * 0.3;
    
    gl_FragColor = vec4(uColor * centerBrightness, alpha);
}
