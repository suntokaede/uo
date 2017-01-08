#define delta ( 1.0 / 60.0 )

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D( texturePosition, uv ).xyz;
    vec3 height = texture2D( textureHeight, uv ).xyz;

    gl_FragColor = vec4( pos.x, height.x, pos.z, 1.0 );
}
