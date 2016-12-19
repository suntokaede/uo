uniform float time;

void main() {
    float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) ) * 10.0;
    if ( f > 1.0 ) {
        discard;
    }
    gl_FragColor = vec4(abs(sin(time)), abs(cos(time)), abs(sin(time * 2.0)), 1.0) * (1.0 - f);
}