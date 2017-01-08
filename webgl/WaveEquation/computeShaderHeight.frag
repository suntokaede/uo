vec4 tex(vec2 uv) {
    return texture2D( textureHeight, uv );
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 pixel = 1.0 / resolution.xy;

    float accel = tex(uv + pixel * vec2(1, 0)).x +
                  tex(uv - pixel * vec2(1, 0)).x +
                  tex(uv + pixel * vec2(0, 1)).x +
                  tex(uv - pixel * vec2(0, 1)).x -
                  tex(uv).x * 4.0;

    accel *= 0.5;

    float speed = (tex(uv).y + accel) * 0.999;

    gl_FragColor = vec4(tex(uv).x + speed, speed, .0, .0);
}
