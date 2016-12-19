#define delta ( 1.0 / 60.0 )

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D( texturePosition, uv ).xyz;
    vec3 vel = texture2D( textureVelocity, uv ).xyz;
    pos += vel * delta;
    gl_FragColor = vec4( pos, 1.0 );
}