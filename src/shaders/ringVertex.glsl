#include <common>
#include <logdepthbuf_pars_vertex>

varying vec3 vPos;
varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    vPos = position;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    #include <logdepthbuf_vertex>
}
