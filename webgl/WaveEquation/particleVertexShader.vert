#include <common>
uniform sampler2D texturePosition;
uniform float cameraConstant;
uniform float density;
varying vec2 vUv;
varying vec3 vPos;
uniform float radius;

void main() {
    vec3 pos = texture2D( texturePosition, uv ).xyz;

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 0.42 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    vPos = pos;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;
}
