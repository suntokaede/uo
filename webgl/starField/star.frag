uniform vec2 resolution;
varying vec3 vColor;
varying float vTime;

void main(){
        float color = max(1.0 - length(gl_PointCoord * 2.0 - 1.0) + 0.22, 0.0);
        color = pow(color, 5.0);
        gl_FragColor = vec4(vec3(color) * vColor, 1.0);
}
