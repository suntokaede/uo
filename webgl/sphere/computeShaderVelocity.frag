#include <common>

uniform int clicked;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float idParticle = uv.y * resolution.x + uv.x;
    vec3 vel = texture2D( textureVelocity, uv ).xyz;
    if(clicked == 0){
        vel.x = 0.0;
        vel.y = 0.0;
        vel.z = 0.0;
    } else {
        float a = fract(dot(gl_FragCoord.xy, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
        float s = a * (6.182785114200511 + a*a * (-38.026512460676566 + a*a * 53.392573080032137));
        float t = fract(s * 43758.5453);
        vel.x = t;
        vel.y = t;
        vel.z = t;
    }
    gl_FragColor = vec4( vel, 1.0 );
}