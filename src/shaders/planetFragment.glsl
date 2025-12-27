#include <common>
#include <logdepthbuf_pars_fragment>

uniform float uTime;
uniform float uSeed;
uniform vec3 uBaseColor;
uniform float uTemperature;
uniform int uPlanetType; // 0: rocky, 1: super-earth, 2: gas

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vWorldPosition;

// Simplex 3D Noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    #include <logdepthbuf_fragment>
    // Use normalized position to ensure noise scale is consistent regardless of planet size
    vec3 spherePos = normalize(vPosition);
    
    // Derive multiple random factors from the single seed
    float seed1 = fract(uSeed * 123.456);
    float seed2 = fract(uSeed * 789.012);
    float seed3 = fract(uSeed * 345.678);
    
    // Randomize noise scale (continents size)
    float noiseScale = 1.5 + seed1 * 2.5;
    vec3 pos = spherePos * noiseScale + uSeed * 100.0;
    float n = 0.0;
    
    // Fractal noise with 8 octaves
    float amplitude = 0.5;
    float frequency = 1.0;
    float lacunarity = 2.0 + seed2 * 0.5; // Randomize "organicness"
    for(int i = 0; i < 8; i++) {
        n += amplitude * snoise(pos * frequency);
        frequency *= lacunarity;
        amplitude *= 0.5;
    }
    
    n = n * 0.5 + 0.5;

    vec3 normal = normalize(vNormal);
    vec3 color = uBaseColor;
    float specular = 0.0;
    
    if (uPlanetType == 0 || uPlanetType == 1) { // Rocky or Super-Earth
        // Randomize land/water ratio
        float threshold = 0.35 + seed3 * 0.25;
        
        if (uTemperature < 273.0) { // Frozen World
            vec3 iceColor = vec3(0.85, 0.9, 1.0) + seed1 * 0.1;
            vec3 rockColor = uBaseColor * (0.2 + seed2 * 0.2);
            float iceMask = smoothstep(threshold - 0.1, threshold + 0.1, n);
            color = mix(rockColor, iceColor, iceMask);
            specular = iceMask * 0.4;
        } else if (uTemperature > 450.0) { // Volcanic World
            vec3 lavaColor = mix(vec3(1.0, 0.1, 0.0), vec3(1.2, 0.4, 0.0), seed1); 
            vec3 crustColor = vec3(0.1, 0.08, 0.08) * (0.5 + seed2);
            float lavaMask = pow(n, 3.0 + seed3 * 3.0);
            color = mix(crustColor, lavaColor, lavaMask);
            specular = 0.0;
        } else { // Temperate World
            // Randomize water colors
            vec3 deepWater = mix(vec3(0.01, 0.02, 0.1), vec3(0.01, 0.1, 0.15), seed1);
            vec3 shallowWater = mix(vec3(0.05, 0.2, 0.4), vec3(0.1, 0.4, 0.5), seed2);
            
            // Randomize land colors slightly from base
            vec3 landColor = uBaseColor;
            vec3 mountainColor = mix(vec3(0.3, 0.25, 0.2), vec3(0.5, 0.45, 0.4), seed3);
            
            float coast = step(threshold, n);
            float waterDepth = smoothstep(0.0, threshold, n);
            vec3 water = mix(deepWater, shallowWater, waterDepth);
            
            float elevation = smoothstep(threshold, 1.0, n);
            vec3 land = mix(landColor, mountainColor, pow(elevation, 1.5 + seed1));
            
            if (uTemperature > 275.0 && uTemperature < 330.0) {
                vec3 forest = mix(vec3(0.05, 0.2, 0.05), vec3(0.2, 0.3, 0.1), seed2);
                land = mix(land, forest, smoothstep(0.05, 0.4, elevation) * (0.4 + seed3 * 0.4));
            }
            
            color = mix(water, land, coast);
            specular = (1.0 - coast) * 0.6;
        }
        
        // Randomize Clouds
        float cloudDensity = 0.3 + seed1 * 0.4;
        float cloudScale = 1.5 + seed2 * 2.0;
        float cloudN = snoise(spherePos * cloudScale + uTime * 0.01 + uSeed * 50.0);
        cloudN += 0.5 * snoise(spherePos * cloudScale * 2.0 - uTime * 0.015);
        float clouds = smoothstep(1.0 - cloudDensity, 1.1 - cloudDensity, cloudN * 0.5 + 0.5);
        color = mix(color, vec3(0.9, 0.9, 0.95), clouds * (0.4 + seed3 * 0.3));
        specular *= (1.0 - clouds);
        
    } else { // Gas Giant
        // Randomize band count and turbulence
        float bandFreq = 30.0 + seed1 * 60.0;
        float turbIntensity = 0.05 + seed2 * 0.15;
        float turbulence = snoise(vec3(spherePos.xy * 2.0, uTime * 0.02)) * turbIntensity;
        float bands = sin(vUv.y * bandFreq + turbulence * 20.0 + uSeed * 100.0);
        bands = smoothstep(-0.3, 0.3, bands);
        
        vec3 bandColor1 = uBaseColor * (0.4 + seed1 * 0.3);
        vec3 bandColor2 = uBaseColor * (1.2 + seed2 * 0.6);
        color = mix(bandColor1, bandColor2, bands);
        
        // Randomize Storms
        float stormScale = 8.0 + seed3 * 10.0;
        float stormN = snoise(vec3(vUv * stormScale, uSeed * 77.0));
        float storm = smoothstep(0.75, 0.85, stormN);
        vec3 stormColor = mix(vec3(1.0, 0.9, 0.8), vec3(0.8, 0.4, 0.3), seed1);
        color = mix(color, stormColor, storm * 0.7);
    }

    // Lighting relative to the star at (0,0,0)
    vec3 lightDir = normalize(-vWorldPosition); 
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 nNormal = normalize(normal);
    
    // Diffuse - raw dot product for day/night calculation
    float rawDiff = dot(nNormal, lightDir);
    float diff = max(rawDiff, 0.0);
    
    // Sunset / Terminator tint - only at the edge
    float terminator = smoothstep(-0.02, 0.1, rawDiff) * smoothstep(0.3, 0.0, rawDiff);
    vec3 sunsetTint = vec3(1.0, 0.4, 0.2) * terminator * 0.4;
    
    // Specular (Blinn-Phong) - only on lit side
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(nNormal, halfDir), 0.0), 32.0) * specular * diff;
    
    // Final color - dark side is completely black (no ambient)
    vec3 finalColor = color * diff + sunsetTint + vec3(spec);
    
    // Atmosphere / Rim Light - only visible on lit side and terminator
    float rim = 1.0 - max(dot(nNormal, viewDir), 0.0);
    rim = pow(rim, 6.0);
    vec3 atmosphereColor = mix(vec3(0.4, 0.6, 1.0), vec3(1.0, 0.8, 0.5), terminator);
    // Rim only appears where there's some light
    float rimVisibility = smoothstep(-0.1, 0.2, rawDiff);
    finalColor += atmosphereColor * rim * 0.3 * rimVisibility;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
