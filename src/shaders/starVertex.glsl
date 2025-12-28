#include <common>
#include <logdepthbuf_pars_vertex>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    
    // Transform normal to world space
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
    
    #include <logdepthbuf_vertex>
}
