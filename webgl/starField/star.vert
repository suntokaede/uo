attribute float raDegree; // 赤経
attribute float decDegree; // 赤緯
attribute vec3 color;
uniform float time;
varying vec3 vColor;
varying float vTime;

void main(){
    vColor = color;
    vTime = time;
    float radius = 10.0; // 球の半径
    float x = radius * sin(decDegree) * sin(raDegree - radians(time));
    float y = radius * cos(decDegree);
    float z = radius * sin(decDegree) * cos(raDegree - radians(time));
    gl_PointSize = 12.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
}
