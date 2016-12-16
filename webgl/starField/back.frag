uniform vec2 resolution;
    void main(){
      const vec4 color1 = vec4(0.0, 0.18, 0.28, 1.0);
      const vec4 color2 = vec4(0.0, 0.0, 0.0, 1.0);
      float percent = 1.0 - (gl_FragCoord.y / resolution.y);
      gl_FragColor = color1 * percent + color2 * (1.0 - percent);
    }
