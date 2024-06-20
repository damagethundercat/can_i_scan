document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const overlay = document.getElementById('overlay');
    const disconnectedText = document.getElementById('disconnected');
    const connectedText = document.getElementById('connected');
    const clickToStartText = document.getElementById('clickToStart');
    const weatherInfo = document.getElementById('weatherInfo');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new THREE.PointerLockControls(camera, document.body);
    scene.add(controls.getObject());

    // 기존 클릭 이벤트 핸들러 수정
    document.addEventListener('click', () => {
        if (overlay.style.display !== 'none') {
            overlay.style.display = 'none';
            controls.lock(); // 오버레이가 사라질 때 PointerLockControl 활성화
        } else {
            controls.lock();
        }
        showInstruction(); // 화면을 클릭하면 설명을 표시
    }, false);

    // Initial Animation
    setTimeout(() => {
        disconnectedText.style.display = 'none';
        connectedText.style.display = 'block';
    }, 3000); // 3 seconds delay

    setTimeout(() => {
        clickToStartText.style.display = 'block';
    }, 4000); // 4 seconds delay

    function showInstruction() {
        const instruction = document.getElementById('instruction');
        instruction.style.display = 'block';
        setTimeout(() => {
            instruction.innerText = 'can_i_scan_?';
        }, 4000); // 4 seconds delay to change text
    }

    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;
    let shiftPressed = false;
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const clock = new THREE.Clock();
    const moveSpeed = 40.0;
    const shiftMultiplier = 2.0;

    const onKeyDown = function(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;
            case 'ArrowLeft':
            case 'KeyD':
                moveLeft = true;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;
            case 'ArrowRight':
            case 'KeyA':
                moveRight = true;
                break;
            case 'KeyQ':
                moveDown = true;
                break;
            case 'KeyE':
                moveUp = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                shiftPressed = true;
                break;
        }
    };

    const onKeyUp = function(event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;
            case 'ArrowLeft':
            case 'KeyD':
                moveLeft = false;
                break;
            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;
            case 'ArrowRight':
            case 'KeyA':
                moveRight = false;
                break;
            case 'KeyQ':
                moveDown = false;
                break;
            case 'KeyE':
                moveUp = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                shiftPressed = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    const initialCameraPosition = new THREE.Vector3(0, 0, 0);
    camera.position.copy(initialCameraPosition);
    controls.getObject().position.copy(initialCameraPosition);

    const raycaster = new THREE.Raycaster();

    let locationRoomModel, detectionModel, roomTextModel;
    let locationYard1Model;
    let cameraModel, detection2Model;
    let macbookModel, detection3Model;
    let textDrawRotationModel, textDrawRotationMixer;
    let turnbackModel;
    let textYardRotationModel, textYardRotationMixer;
    let bunniesModel, detection4Model;
    let uoslogoRotationModel, uoslogoRotationMixer;
    let locationYard2Model;
    let locationYard3Model;
    let Yardtext3Model;
    let classtextModel;



    const groups = {
        room: ['room.glb', 'bluebook.glb', '001detection.glb', 'macbook_inroom.glb', '003detection.glb', 'camera.glb', '002detection.glb', 'room_text.glb','location_room.glb'],
        hall: ['hall.glb', 'text_draw_rotation.glb','hall_text.glb','bunnies.glb', 'hall_2.glb', 'hall_face.glb', 'turnback.glb', '004detection.glb'],
        yard1: ['yard1.glb', 'location_yard1.glb', 'yard1_text_rotation.glb', 'uos_logo.glb'],
        yard2: ['yard2.glb', 'location_yard2.glb'],
        yard3: ['yard3.glb', 'yard3_text.glb', 'yard3_text2.glb', 'location_yard3.glb'],
        class: ['class.glb', 'class_text.glb']
    };

    const loader = new THREE.GLTFLoader();

    for (const groupName in groups) {
        const groupContainer = new THREE.Group();
        groupContainer.name = groupName;
        scene.add(groupContainer);

        groups[groupName].forEach(url => {
            loader.load(url, function(gltf) {
                const model = gltf.scene;
                groupContainer.add(model);
                console.log(`Loaded ${url} into group ${groupName}`);
                if (url === 'location_room.glb') locationRoomModel = model;
                if (url === 'location_yard1.glb') locationYard1Model = model;
                if (url === 'location_yard2.glb') locationYard2Model = model;
                if (url === 'location_yard3.glb') locationYard3Model = model;
                if (url === 'bluebook.glb') bluebookModel = model;
                if (url === '001detection.glb') {
                    detectionModel = model;
                    detectionModel.visible = false;
                }
                if (url === 'camera.glb') cameraModel = model;
                if (url === '002detection.glb') {
                    detection2Model = model;
                    detection2Model.visible = false;
                }
                if (url === 'macbook_inroom.glb') macbookModel = model;
                if (url === '003detection.glb') {
                    detection3Model = model;
                    detection3Model.visible = false;
                }
                if (url === 'bunnies.glb') bunniesModel = model;
                if (url === '004detection.glb') {
                    detection4Model = model;
                    detection4Model.visible = false;
                }
                if (url === 'room_text.glb') {
                    roomTextModel = model;
                    roomTextModel.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }
                if (url === 'yard3_text.glb') {
                    Yardtext3Model = model;
                    Yardtext3Model.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }
                if (url === 'turnback.glb') {
                    turnbackModel = model;
                    turnbackModel.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }
                if (url === 'class_text.glb') {
                    classtextModel = model;
                    classtextModel.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }
                if (url === 'text_draw_rotation.glb') {
                    textDrawRotationModel = model;
                    if (gltf.animations && gltf.animations.length) {
                        textDrawRotationMixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach(clip => {
                            textDrawRotationMixer.clipAction(clip).play();
                        });
                    }
                    textDrawRotationModel.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }
                /*if (url === 'yard1_text_rotation.glb') {
                    textYardRotationModel = model;
                    if (gltf.animations && gltf.animations.length) {
                        textYardRotationMixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach(clip => {
                            textYardRotationMixer.clipAction(clip).play();
                        });
                    }
                    textYardRotationModel.traverse(child => {
                        if (child.isMesh) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                            child.layers.enable(1);
                        }
                    });
                }*/
                if (url === 'uos_logo.glb') {
                    uoslogoRotationModel = model;
                    if (gltf.animations && gltf.animations.length) {
                        uoslogoRotationMixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach(clip => {
                            uoslogoRotationMixer.clipAction(clip).play();
                        });
                    }
                    ;
                }
            }, undefined, function(error) {
                console.error(`An error happened while loading ${url}`, error);
            });
        });
    }

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(1);

    const materials = {};
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    function darkenNonBloomed(obj) {
        if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
            materials[obj.uuid] = obj.material;
            obj.material = darkMaterial;
        }
    }

    function restoreMaterial(obj) {
        if (materials[obj.uuid]) {
            obj.material = materials[obj.uuid];
            delete materials[obj.uuid];
        }
    }

    const renderScene = new THREE.RenderPass(scene, camera);

    const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0;

    const bloomComposer = new THREE.EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const finalPass = new THREE.ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;
                varying vec2 vUv;
                void main() {
                    gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
                }
            `,
            defines: {}
        }), "baseTexture"
    );
    finalPass.needsSwap = true;
    const finalComposer = new THREE.EffectComposer(renderer);
    finalComposer.addPass(renderScene);
    finalComposer.addPass(finalPass);

    const lensDistortionShader = {
        uniforms: {
            "tDiffuse": { value: null },
            "strength": { value: 3.5 },
            "height": { value: 1.0 },
            "aspectRatio": { value: 1.5 },
            "cylindricalRatio": { value: 1.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, .6);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float strength;
            uniform float height;
            uniform float aspectRatio;
            uniform float cylindricalRatio;
            varying vec2 vUv;

            void main() {
                vec2 uv = vUv;
                vec2 uvCenter = vec2(0.5, 0.5);
                vec2 texCoord = uv - uvCenter;
                texCoord.y *= height / aspectRatio;
                texCoord.x *= aspectRatio;
                float radius = length(texCoord);
                float distortion = smoothstep(0.35, 0.4, radius);
                vec4 color = texture2D(tDiffuse, uv + texCoord * (strength * radius * (0.3 - distortion)));
                color.rgb = mix(color.rgb, vec3(0.0), distortion);
                gl_FragColor = color;
            }
        `
    };

    const lensDistortionPass = new THREE.ShaderPass(lensDistortionShader);
    lensDistortionPass.renderToScreen = true;
    finalComposer.addPass(lensDistortionPass);

    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.5;
    spotlight.decay = 2;
    spotlight.distance = 500;
    spotlight.castShadow = true;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    scene.add(spotlight);

    function updateSpotlight() {
        spotlight.position.copy(camera.position);
        spotlight.target.position.set(
            camera.position.x + camera.getWorldDirection(new THREE.Vector3()).x,
            camera.position.y + camera.getWorldDirection(new THREE.Vector3()).y,
            camera.position.z + camera.getWorldDirection(new THREE.Vector3()).z
        );
        spotlight.target.updateMatrixWorld();
    }

    function checkIntersection(event) {
        raycaster.setFromCamera({ x: 0, y: 0 }, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        let foundLocationRoom = false;
        let foundLocationYard1 = false;
        let foundLocationYard2 = false;
        let foundLocationYard3 = false;
        let foundBluebook = false;
        let foundCamera = false;
        let foundMacbook = false;
        let foundBunnies = false;

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            if (locationRoomModel && (intersectedObject === locationRoomModel || locationRoomModel.children.includes(intersectedObject))) {
                foundLocationRoom = true;
            }
            if (locationYard1Model && (intersectedObject === locationYard1Model || locationYard1Model.children.includes(intersectedObject))) {
                foundLocationYard1 = true;
            }
            if (locationYard2Model && (intersectedObject === locationYard2Model || locationYard2Model.children.includes(intersectedObject))) {
                foundLocationYard2 = true;
            }
            if (locationYard3Model && (intersectedObject === locationYard3Model || locationYard3Model.children.includes(intersectedObject))) {
                foundLocationYard3 = true;
            }
            if (bluebookModel && (intersectedObject === bluebookModel || bluebookModel.children.includes(intersectedObject))) {
                foundBluebook = true;
            }
            if (cameraModel && (intersectedObject === cameraModel || cameraModel.children.includes(intersectedObject))) {
                foundCamera = true;
            }
            if (macbookModel && (intersectedObject === macbookModel || macbookModel.children.includes(intersectedObject))) {
                foundMacbook = true;
            }
            if (bunniesModel && (intersectedObject === bunniesModel || bunniesModel.children.includes(intersectedObject))) {
                foundBunnies = true;
            }
        }

        if (detectionModel) {
            if (foundBluebook) {
                detectionModel.visible = true;
                detectionModel.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.enable(1);
                    }
                });
            } else {
                detectionModel.visible = false;
                detectionModel.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.disable(1);
                    }
                });
            }
        }

        if (detection2Model) {
            if (foundCamera) {
                detection2Model.visible = true;
                detection2Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.enable(1);
                    }
                });
            } else {
                detection2Model.visible = false;
                detection2Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.disable(1);
                    }
                });
            }
        }

        if (detection3Model) {
            if (foundMacbook) {
                detection3Model.visible = true;
                detection3Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.enable(1);
                    }
                });
            } else {
                detection3Model.visible = false;
                detection3Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.disable(1);
                    }
                });
            }
        }

        if (detection4Model) {
            if (foundBunnies) {
                detection4Model.visible = true;
                detection4Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.enable(1);
                    }
                });
            } else {
                detection4Model.visible = false;
                detection4Model.traverse(function(child) {
                    if (child.isMesh) {
                        child.layers.disable(1);
                    }
                });
            }
        }

        if (foundLocationRoom) {
            fetchWeatherData(37.61, 127.10);
        }

        if (foundLocationYard1) {
            fetchWeatherData(37.58, 127.06); 
        }

        if (foundLocationYard2) {
            fetchWeatherData(37.61, 127.09);
        }

        if (foundLocationYard3) {
            fetchWeatherData(37.61, 127.10);
        }
    }
    
    
    function fetchWeatherData(latitude, longitude) {
        const apiKey = 'ae7802f9814d477f37a18a9c07834d54';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weatherDescription = data.weather[0].description;
                const temperature = data.main.temp;
                const humidity = data.main.humidity;
                const feels_like = data.main.feels_like;
                const windspeed = data.wind.speed;
    
                weatherInfo.innerHTML = `
                    Weather: ${weatherDescription}
                    <p>Temperature: ${temperature} °C
                    <p>Humidity: ${humidity} %<p>
                    <p>Feels Like: ${feels_like} °C
                    <p>Wind Speed: ${windspeed}
                `;
                weatherInfo.style.display = 'block';
    
                setTimeout(() => {
                    weatherInfo.style.display = 'none';
                }, 30000); // 30초 후에 숨김
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
    
    // 텍스트 생성 및 구형 배치
function createSphericalText(textArray, font, radius) {
    const textGroup = new THREE.Group();
    textArray.forEach((text, index) => {
        const phi = Math.acos(-1 + (2 * index) / textArray.length);
        const theta = Math.sqrt(textArray.length * Math.PI) * phi;

        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: .5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
        textMesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
        textMesh.position.z = radius * Math.cos(phi);

        textMesh.lookAt(new THREE.Vector3(0, 0, 0));

        textGroup.add(textMesh);
    });
    return textGroup;
}
    
    const fontLoader = new THREE.FontLoader();
    fontLoader.load('../Noto Sans KR_Regular.json', function(font) {
        const longText = `playable rP 테크놀로지 포복 뒤 호텔 방 하늘에서 떨어지는 폭탄 icbm 푸른 초원 사이 흐르는 시냇물과 강 돌 전력질주 암벽과 용암 갈라진 절벽에 붙은 나무껍질을 뗴고 비상 후 추락 횃불이 밝히는 어둠으로 가득 차있는 동굴 너머 보이는 박쥐의 형상 다시 돌아와 초록빛깔 공기 속에 갇힌 도시 매트릭스현실 검은 서글라스를 피부처럼 끼고있는 사람들 위로 떨어지는 가스폭탄 초록색 가스 방독면을 쓰고 돌진 광원 벤츠로고같은 삼각별이 회전하고 초록색이 번져나가 은하계 성운을 이룬다 도마뱀 도마뱀의 꼬리를 도끼로 내려찍고 보이는 건 피를 흘리며 기어서 탈출하는 도마뱀 추적하는 화살 옆 터지는 파열음 공기와 마찰음 pure sense 화강암 석좌 위 불길이 번지고 그 안에 보이는 새의 형상 손바닥의 냄새 흐르는 땀을 움켜쥐고 구슬을 놓쳐 땅에 떨어진 뒤 산산조각 머리를 찌르는 편두통 오른쪽 관자놀이부터 찔려들어가 왼쪽으로 나오진 못해 중앙에 걸쳐있어 뽑으면 피가나니까 꺾어서 멈추자`;

        const textArray = longText.match(/.{1,10}/g); // 30자 단위로 텍스트를 나눕니다.
        
        const textGroup = createSphericalText(textArray, font, 7);

        // 텍스트 그룹 위치 설정
        textGroup.position.set(20, 5, -40); // 원하는 위치로 조정

        scene.add(textGroup);
    
        // 텍스트 회전 애니메이션
        /*function rotateText() {
            textGroup.rotation.y += 0.01;
            requestAnimationFrame(rotateText);
        }
        rotateText();*/
    });

    function render() {
        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);
        finalComposer.render();
    }

    function animate() {
        requestAnimationFrame(animate);
        updateSpotlight();
        const delta = clock.getDelta();
        if (textDrawRotationMixer) textDrawRotationMixer.update(delta);
        if (textYardRotationMixer) textYardRotationMixer.update(delta);
        if (uoslogoRotationMixer) uoslogoRotationMixer.update(delta);

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveUp) - Number(moveDown);
        direction.normalize();

        const speed = shiftPressed ? moveSpeed * shiftMultiplier : moveSpeed;
        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;
        if (moveUp || moveDown) velocity.y -= direction.y * speed * delta;

        controls.getObject().translateX(velocity.x * delta);
        controls.getObject().translateY(velocity.y * delta);
        controls.getObject().translateZ(velocity.z * delta);

        checkIntersection();  // 교차 검사 및 상태 업데이트
        render();

        // 카메라 위치를 로컬 스토리지에 저장
        localStorage.setItem('cameraPosition', JSON.stringify(camera.position));
        localStorage.setItem('cameraRotation', JSON.stringify(camera.rotation));
    }

    // room_text.glb 오브젝트 점멸 효과
    function blinkRoomText() {
        if (roomTextModel) {
            roomTextModel.traverse(child => {
                if (child.isMesh) {
                    child.visible = !child.visible;
                }
            });
        }
    }

    function blinkTurnBack() {
        if (turnbackModel) {
            turnbackModel.traverse(child => {
                if (child.isMesh) {
                    child.visible = !child.visible;
                }
            });
        }
    }

    function blinkRotationText() {
        if (textDrawRotationModel) {
            textDrawRotationModel.traverse(child => {
                if (child.isMesh) {
                    child.visible = !child.visible;
                }
            });
        }
    }


    function blinkYard3Text() {
        if (Yardtext3Model) {
            Yardtext3Model.traverse(child => {
                if (child.isMesh) {
                    child.visible = !child.visible;
                }
            });
        }
    }

    function blinkClassText() {
        if (classtextModel) {
            classtextModel.traverse(child => {
                if (child.isMesh) {
                    child.visible = !child.visible;
                }
            });
        }
    }
    setInterval(blinkRoomText, 500);  // 500ms 간격으로 점멸
    setInterval(blinkRotationText, Math.random());
    /*setInterval(blinkTurnBack, Math.random());
    setInterval(blinkYard3Text, Math.random());
    setInterval(blinkClassText, Math.random());*/

    animate();

    window.addEventListener('resize', function() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
