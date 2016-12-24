import GPUComputationRenderer from '../GPUComputationRenderer'

const source = ['webgl/ImageParticle/computeShaderPosition.frag', 'webgl/ImageParticle/computeShaderVelocity.frag', 'webgl/ImageParticle/particleFragmentShader.frag', 'webgl/ImageParticle/particleVertexShader.vert'];

export default class ImageParticle {
    async init(options, callback) {
        this.options = options;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new THREE.PerspectiveCamera(75, this.options.width / this.options.height, 5, 15000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 300;
        this.renderer.setSize(this.options.width, this.options.height);
        this.renderer.setClearColor( 0xcccccc );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        document.querySelector(this.options.query).appendChild(this.renderer.domElement);

        this.shader = await this.loadShader(source);

        if(!this.options.thumbnailMode){
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        }

        const WIDTH = 500;
        const PARTICLES = WIDTH * WIDTH;

        this.gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, this.renderer);

        const destPos = this.gpuCompute.createTexture();
        const destVel = this.gpuCompute.createTexture();

        const posArray = destPos.image.data;
        const velArray = destVel.image.data;

        for(let j = 0; j < 500; j++) {
            for(let n = 0; n < 500; n++){
                posArray[j * 2000 + n * 4] = (j - 250) * 0.8;
                posArray[j * 2000 + n * 4 + 1] = (n - 250) * 0.8;
                posArray[j * 2000 + n * 4 + 2] = 0;
                posArray[j * 2000 + n * 4 + 3] = 0;
            }
        }

        for(let i = 0, l = posArray.length; i < l; i += 4){          
            velArray[i] = Math.random() * 2 - 1;
            velArray[i + 1] = Math.random() * 2 - 1;
            velArray[i + 2] = Math.random() * 2 - 1;
            velArray[i + 3] = Math.random() * 2 - 1;
        }

        this.velocityVariable = this.gpuCompute.addVariable( "textureVelocity", this.shader[1], destVel);
        this.positionVariable = this.gpuCompute.addVariable( "texturePosition", this.shader[0], destPos);

        // 一連の関係性を構築するためのおまじない
        this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] );
        this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] );

        this.velocityVariable.material.uniforms.clicked = { value: 0 };

        document.querySelector(this.options.query).addEventListener("dblclick", e => {
            if(!this.velocityVariable.material.uniforms.clicked.value) {
                this.velocityVariable.material.uniforms.clicked.value = 1;
            } else {
                this.velocityVariable.material.uniforms.clicked.value = 0;                
            }
        }, false);

        // error処理
        const error = this.gpuCompute.init();
        if ( error !== null ) {
            console.error( error );
        }

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array( PARTICLES * 3 );
        let p = 0;
        for ( let i = 0; i < PARTICLES; i++ ) {
            positions[ p++ ] = 0;
            positions[ p++ ] = 0;
            positions[ p++ ] = 0;
        }

        // uv情報の決定。テクスチャから情報を取り出すときに必要
        const uvs = new Float32Array( PARTICLES * 2 );
        p = 0;
        for ( let j = 0; j < WIDTH; j++ ) {
            for (let i = 0; i < WIDTH; i++ ) {
                uvs[ p++ ] = i / ( WIDTH - 1 );
                uvs[ p++ ] = j / ( WIDTH - 1 );
            }
        }

        // 頂点色
        const colors = await this.getImageColorVec4Array("webgl/ImageParticle/500.jpg");

        // attributeをgeometryに登録する
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
        geometry.addAttribute( 'vertexColor', new THREE.BufferAttribute( colors, 4));

        // uniform変数をオブジェクトで定義
        // 今回はカメラをマウスでいじれるように、計算に必要な情報もわたす。
        this.particleUniforms = {
            texturePosition: { value: null },
            textureVelocity: { value: null },
            cameraConstant: { value: this.getCameraConstant( this.camera ) },
            time: { value: 0.0 }
        };

        // Shaderマテリアル これはパーティクルそのものの描写に必要なシェーダー
        this.material = new THREE.ShaderMaterial( {
            uniforms:       this.particleUniforms,
            vertexShader:   this.shader[3],
            fragmentShader: this.shader[2],
            blending: THREE.AdditiveBlending
        });
        this.material.extensions.drawBuffers = true;
        const particles = new THREE.Points( geometry, this.material );
        particles.matrixAutoUpdate = false;
        particles.updateMatrix();

        // パーティクルをシーンに追加
        this.scene.add(particles);

        this.flag = false;

        callback && callback();

        this.render();
    }

    render() {
        const _this = this;

        const beginDate = new Date();

        _this.gpuCompute.compute();

        _this.material.uniforms.time.value += (beginDate - new Date()) * 0.0000003;

        _this.particleUniforms.texturePosition.value = _this.gpuCompute.getCurrentRenderTarget(_this.positionVariable).texture;
        _this.particleUniforms.textureVelocity.value = _this.gpuCompute.getCurrentRenderTarget(_this.velocityVariable).texture;
        _this.renderer.render(_this.scene, _this.camera);

        (function loop() {
            requestAnimationFrame(loop);

            if(!_this.flag) { return; }

            _this.gpuCompute.compute();

            _this.material.uniforms.time.value += (beginDate - new Date()) * 0.0000003;

            _this.particleUniforms.texturePosition.value = _this.gpuCompute.getCurrentRenderTarget(_this.positionVariable).texture;
            _this.particleUniforms.textureVelocity.value = _this.gpuCompute.getCurrentRenderTarget(_this.velocityVariable).texture;
            _this.renderer.render(_this.scene, _this.camera);
        }());
    }

    getCameraConstant( camera ) {
        return this.options.height / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
    }

    getImageColorVec4Array(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.addEventListener("load", e => {
                const dest = new Float32Array(img.width * img.height * 4);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;

                const rad = 90 * Math.PI / 180;

                ctx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), canvas.width / 2, canvas.height / 2);
                ctx.translate(-canvas.width / 2, -canvas.height / 2);
                ctx.drawImage(img, 0, 0);

                const data = ctx.getImageData(0, 0, img.width, img.height).data;

                // rgbaからvec4に変換
                for(let i = 0, l = data.length; i < l; i++){
                    dest[i] = (data[i] / 255);
                }

                resolve(dest);
            });
        });
    }

    loadShader(src) {
        const arr = [];
        for(let i = 0, l = src.length; i < l; i++) {
            arr.push(fetch(src[i]).then(res => res.text()));
        }
        return Promise.all(arr);
    }
    
    setFlag(flag) {
		this.flag = flag;
	}

    dispose() {
        this.controls && this.controls.dispose();
    }
}