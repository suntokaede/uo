const urls = ['webgl/envMapping/Forest/posx.jpg', 'webgl/envMapping/Forest/negx.jpg', 'webgl/envMapping/Forest/posy.jpg', 'webgl/envMapping/Forest/negy.jpg', 'webgl/envMapping/Forest/posz.jpg', 'webgl/envMapping/Forest/negz.jpg'];

export default class envMapping {
    init(options, callback) {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer();
        const camera = new THREE.PerspectiveCamera(75, options.width / options.height, 0.1, 1000);
        camera.position.z = 5;

        scene.background = new THREE.CubeTextureLoader().load(urls);

        if(!options.thumbnailMode) {
            this.control = new THREE.OrbitControls(camera);
        }

        const container = document.querySelector(options.query);
        container.appendChild(renderer.domElement);

        renderer.setSize(options.width, options.height);
        renderer.setClearColor( 0xeeeeee );

        new THREE.JSONLoader().load("webgl/envMapping/petbottle.json", (geom, mat) => {
            const material = new THREE.MeshBasicMaterial( {
                color: 0xffffff,
                envMap: scene.background , //環境マッピング
                refractionRatio: 0.7, //屈折率
                reflectivity: 1, //反射率
                opacity: 0.6, //不透明度
                transparent: true
            } );
            const mesh = new THREE.Mesh(geom, material);
            scene.add(mesh);

            render();
        });

        const _this = this;

        function render() {
            requestAnimationFrame(render);
            _this.control && _this.control.update();
            renderer.render(scene, camera);
        }
    }

    setFlag(flag){}

    dispose() {
        this.controls && this.controls.dispose();
    }
}