#include <common>
uniform sampler2D texturePosition;
uniform float cameraConstant;
uniform float density;
varying vec2 vUv;
uniform float radius;

void main() {
    vec3 pos = texture2D( texturePosition, uv ).xyz;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 0.5 * cameraConstant / ( - mvPosition.z );

    vUv = uv;

    gl_Position = projectionMatrix * mvPosition;
}