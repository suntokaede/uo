uniform float time;
varying vec2 vUv;
varying vec3 vPos;

void main() {
    gl_FragColor = vec4(vec3(0.02, 0.4, 0.72) * clamp(vec3(vPos.y), 0.4, 1.0), 1.0);
}
