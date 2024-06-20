document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const modelDescription = document.getElementById('model-description');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI / 2;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const initialCameraPosition = new THREE.Vector3(0, 2, 5);
    camera.position.copy(initialCameraPosition);
    controls.target.set(0, 0, 0);
    controls.update();

    let currentEnvMap = null;

    // HDRI 배경 로드
    new THREE.RGBELoader().load('poly2.hdr', function(texture) {
        currentEnvMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.background = currentEnvMap;
        scene.environment = currentEnvMap;
        texture.dispose();
    });

    // 모델 로드
    const loader = new THREE.GLTFLoader();
    loader.load('poly2.glb', function(gltf) {
        const model = gltf.scene;
        scene.add(model);
        model.position.set(0, 0, 0);
        modelDescription.innerText = 'Poly2 Model Description';
    });

    window.addEventListener('resize', function() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
