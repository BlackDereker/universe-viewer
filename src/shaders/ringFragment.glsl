#include <common>
#include <logdepthbuf_pars_fragment>

uniform vec3 baseColor;
varying vec3 vPos;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    #include <logdepthbuf_fragment>
    
    // Radius from center
    float r = length(vPos.xy);
    
    // Generate complex banding pattern based on radius
    float band1 = sin(r * 40.0);
    float band2 = cos(r * 150.0);
    float band3 = sin(r * 10.0 + 3.0);
    
    // Compose density
    float density = 0.5 + 0.25 * band1 + 0.15 * band2 + 0.1 * band3;
    
    // Sharp transparency gaps (simulating divisions)
    if (sin(r * 60.0) > 0.95) density = 0.05;
    
    // Color variation
    vec3 color = baseColor * (0.8 + 0.2 * band1); 
    
    // Lighting relative to star at (0,0,0)
    vec3 lightDir = normalize(-vWorldPosition);
    float diff = max(abs(dot(vNormal, lightDir)), 0.1); // abs because rings are visible from both sides
    
    // Discard nearly transparent pixels so they don't write to depth buffer
    float alpha = density * 0.8;
    if (alpha < 0.1) discard;
    
    gl_FragColor = vec4(color * diff, alpha);
}
