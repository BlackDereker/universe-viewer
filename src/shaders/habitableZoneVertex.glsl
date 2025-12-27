#include <common>
#include <logdepthbuf_pars_vertex>

uniform float uInnerRadius;
uniform float uOuterRadius;

varying vec2 vUv;
varying float vRadius;

void main() {
    vUv = uv;
    
    // Calculate distance from center for this vertex
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vRadius = length(worldPos.xz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    #include <logdepthbuf_vertex>
}
