varying vec2 vTexCoord;
uniform sampler2D tex1;
uniform sampler2D tex2;
void main(){
    gl_FragColor = texture2D(tex1, vTexCoord) + texture2D(tex2, vTexCoord);
}
