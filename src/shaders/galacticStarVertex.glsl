attribute float size;
attribute vec3 customColor;
attribute float isHighlighted;
attribute float isHovered;

varying vec3 vColor;
varying float vHighlight;
varying float vHover;

uniform float time;

void main() {
    vColor = customColor;
    vHighlight = isHighlighted;
    vHover = isHovered;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Base size with highlight pulse
    float pulseScale = 1.0;
    if (isHighlighted > 0.5) {
        pulseScale = 1.0 + 0.3 * sin(time * 3.0);
    }
    if (isHovered > 0.5) {
        pulseScale = 1.5;
    }
    
    gl_PointSize = size * pulseScale * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 2.0, 40.0);
    
    gl_Position = projectionMatrix * mvPosition;
}
