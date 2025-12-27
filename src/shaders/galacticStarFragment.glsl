varying vec3 vColor;
varying float vHighlight;
varying float vHover;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Soft glow falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Brighten highlighted/hovered stars
    vec3 color = vColor;
    if (vHighlight > 0.5) {
        color = mix(color, vec3(1.0, 1.0, 0.5), 0.5);
        alpha *= 1.5;
    }
    if (vHover > 0.5) {
        color = mix(color, vec3(1.0), 0.3);
        alpha *= 1.3;
    }
    
    gl_FragColor = vec4(color, alpha);
}
