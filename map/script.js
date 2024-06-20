document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const scene = new THREE.Scene();

    const aspect = window.innerWidth / window.innerHeight;
    const d = 2.8;
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.panSpeed = 1.0;
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };
    controls.target.set(0, 0, 0);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0x333333, 5);
    scene.add(ambientLight);

    const loader = new THREE.GLTFLoader();

    // 그룹 데이터 배열
    const modelUrls = [
        '../model1/room.glb',
        '../model1/camera.glb',
        '../model1/bluebook.glb',
        '../model1/macbook_inroom.glb',
        '../model1/hall.glb',
        '../model1/room_text.glb',
        '../model1/hall_2.glb',
        '../model1/hall_face.glb',
        '../model1/hall_text.glb',
        '../model1/bunnies.glb',
        '../model1/yard1.glb',
        '../model1/yard2.glb',
        '../model1/uos_logo.glb',
        '../model1/yard3_text.glb',
        '../model1/yard3_text2.glb',
        '../model1/yard3.glb',
        '../model1/class.glb',
        '../model1/class_text.glb'
    ];

    // GLB 파일 로드
    modelUrls.forEach(url => {
        loader.load(url, function(gltf) {
            const model = gltf.scene;
            scene.add(model);
            console.log(`Loaded ${url}`);
        }, undefined, function(error) {
            console.error(`An error occurred loading the model from ${url}`, error);
        });
    });

    camera.position.set(0, 10, 10); // 카메라 위치를 조정하여 모델을 보이게 함
    camera.lookAt(0, 0, 0);

    const cameraInfo = document.getElementById('camera-info');
    const cameraMarker = document.getElementById('camera-marker');

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

        // 로컬 스토리지에서 카메라 위치를 읽어와 반영
        const cameraPosition = JSON.parse(localStorage.getItem('cameraPosition'));
        const cameraRotation = JSON.parse(localStorage.getItem('cameraRotation'));

        if (cameraPosition && cameraRotation) {
            camera.position.set(cameraPosition.x, cameraPosition.y + 20, cameraPosition.z); // y 좌표를 올려서 탑뷰 유지
            controls.target.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
            controls.update();

            // 카메라 위치 정보를 업데이트
            cameraInfo.innerHTML = `
                ${cameraPosition.x.toFixed(2)}<br>
                ${cameraPosition.y.toFixed(2)}<br>
                ${cameraPosition.z.toFixed(2)}
            `;

            // 카메라 마커의 위치를 업데이트
            const markerSize = 10; // 마커 크기 (픽셀)
            const halfMarkerSize = markerSize / 2;
            cameraMarker.style.left = `calc(50% - ${halfMarkerSize}px)`;
            cameraMarker.style.top = `calc(50% - ${halfMarkerSize}px)`;
        }
    }

    animate();

    window.addEventListener('resize', function() {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -d * aspect;
        camera.right = d * aspect;
        camera.top = d;
        camera.bottom = -d;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
