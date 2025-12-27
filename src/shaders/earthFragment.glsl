#include <common>
#include <logdepthbuf_pars_fragment>

uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform sampler2D uCloudMap;
uniform sampler2D uSpecularMap;
uniform sampler2D uNormalMap;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vTangent;
varying vec3 vBitangent;

void main() {
    #include <logdepthbuf_fragment>
    
    // Sample textures
    vec3 dayColor = texture2D(uDayMap, vUv).rgb;
    vec3 nightColor = texture2D(uNightMap, vUv).rgb;
    float clouds = texture2D(uCloudMap, vUv).r;
    float specularMask = texture2D(uSpecularMap, vUv).r;
    
    // Sample and apply normal map
    vec3 normalMapValue = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
    mat3 TBN = mat3(vTangent, vBitangent, vNormal);
    vec3 normal = normalize(TBN * normalMapValue);
    
    // Lighting - star at origin
    vec3 lightDir = normalize(-vWorldPosition);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    
    // Diffuse lighting with normal map
    float rawDiff = dot(normal, lightDir);
    float diff = max(rawDiff, 0.0);
    
    // Day/Night blend - sharper transition at terminator
    float dayNightMix = smoothstep(-0.05, 0.15, rawDiff);
    
    // Night lights (city lights) - only visible on dark side
    vec3 nightLights = nightColor * 3.0; // Boost city lights
    
    // Animated clouds
    vec2 cloudUv = vUv + vec2(uTime * 0.001, 0.0);
    float animatedClouds = texture2D(uCloudMap, cloudUv).r;
    
    // Day side: use day texture with clouds
    // Night side: completely dark except for city lights
    vec3 dayWithClouds = mix(dayColor, vec3(1.0), animatedClouds * 0.6);
    vec3 litSurface = dayWithClouds * diff;
    
    // City lights only appear on the dark side (not covered by clouds)
    float nightVisibility = 1.0 - dayNightMix;
    float cloudCover = animatedClouds * 0.7; // Clouds block city lights
    vec3 cityLights = nightLights * nightVisibility * (1.0 - cloudCover);
    
    // Combine lit surface and city lights
    vec3 finalColor = litSurface + cityLights;
    
    // Specular highlight for water/oceans - only on lit, cloud-free areas
    float cloudReduction = 1.0 - animatedClouds * 0.8;
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);
    finalColor += vec3(1.0, 0.95, 0.9) * spec * specularMask * diff * cloudReduction * 0.6;
    
    // Terminator glow (sunrise/sunset colors)
    float terminator = smoothstep(-0.02, 0.1, rawDiff) * smoothstep(0.25, 0.0, rawDiff);
    finalColor += vec3(1.0, 0.5, 0.2) * terminator * 0.35;
    
    // Atmospheric rim glow - only visible where there's sunlight (lit side and terminator only)
    float rim = 1.0 - max(dot(vNormal, viewDir), 0.0);
    rim = pow(rim, 4.0);
    vec3 atmosphereColor = vec3(0.4, 0.6, 1.0);
    // Rim requires sunlight - only appears on lit side, fades completely on dark side
    float rimVisibility = smoothstep(0.0, 0.3, rawDiff);
    finalColor += atmosphereColor * rim * 0.35 * rimVisibility;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
