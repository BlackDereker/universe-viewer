#include <common>
#include <logdepthbuf_pars_vertex>

uniform float uTime;
uniform float uPulsationAmplitude;
uniform float uPulsationPeriod;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    
    // Transform normal to world space
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    // Pulsation effect for variable stars (M-type red dwarfs, etc.)
    float pulsation = 1.0;
    if (uPulsationPeriod > 0.0) {
        pulsation = 1.0 + uPulsationAmplitude * sin(uTime * 6.28318 / uPulsationPeriod);
    }
    
    vec3 pulsedPosition = position * pulsation;
    
    vec4 worldPosition = modelMatrix * vec4(pulsedPosition, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    
    #include <logdepthbuf_vertex>
}
