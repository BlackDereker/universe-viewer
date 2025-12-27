varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    // World space normal
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
