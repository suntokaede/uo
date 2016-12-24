#include <common>
attribute vec4 vertexColor;
uniform sampler2D texturePosition;
uniform float cameraConstant;
uniform float density;
varying vec2 vUv;
varying vec4 vColor;
uniform float radius;

void main() {
    vec3 pos = texture2D( texturePosition, uv ).xyz;

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 0.42 * cameraConstant / ( - mvPosition.z );

    vUv = uv;

    vColor = vertexColor;

    gl_Position = projectionMatrix * mvPosition;
}