#include <common>
#include <logdepthbuf_pars_vertex>

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vTangent;
varying vec3 vBitangent;

void main() {
    vUv = uv;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    // Calculate tangent and bitangent for normal mapping
    vec3 tangent = normalize(vec3(-sin(uv.x * 6.28318), 0.0, cos(uv.x * 6.28318)));
    vTangent = normalize(mat3(modelMatrix) * tangent);
    vBitangent = normalize(cross(vNormal, vTangent));
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    #include <logdepthbuf_vertex>
}
