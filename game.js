// Szene, Kamera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Pointer-Lock-Steuerung
const controls = new THREE.PointerLockControls(camera, document.body);

document.addEventListener("click", () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    document.getElementById('info').style.display = "none";
});

controls.addEventListener('unlock', () => {
    document.getElementById('info').style.display = "";
});

scene.add(controls.getObject());

// Boden
const floorGeometry = new THREE.BoxGeometry(100, 1, 100);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
scene.add(floor);

// Licht
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// Parkour Plattformen
function createPlatform(x, y, z) {
    const geo = new THREE.BoxGeometry(5, 1, 5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const platform = new THREE.Mesh(geo, mat);
    platform.position.set(x, y, z);
    scene.add(platform);
}

createPlatform(0, 2, -10);
createPlatform(5, 4, -20);
createPlatform(-5, 6, -30);
createPlatform(0, 8, -40);

// Ziel
const goalGeo = new THREE.BoxGeometry(3, 3, 3);
const goalMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const goal = new THREE.Mesh(goalGeo, goalMat);
goal.position.set(0, 10, -50);
scene.add(goal);

// Bewegung
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let canJump = false;

const keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked) {
        direction.set(0, 0, 0);

        if (keys["KeyW"]) direction.z -= 1;
        if (keys["KeyS"]) direction.z += 1;
        if (keys["KeyA"]) direction.x -= 1;
        if (keys["KeyD"]) direction.x += 1;

        direction.normalize();

        const speed = 0.1;

        velocity.x = direction.x * speed;
        velocity.z = direction.z * speed;

        controls.moveRight(velocity.x);
        controls.moveForward(velocity.z);

        velocity.y -= 0.01;

        const pos = controls.getObject().position;
        pos.y += velocity.y;

        if (pos.y < 1.5) {
            velocity.y = 0;
            pos.y = 1.5;
            canJump = true;
        }

        if (keys["Space"] && canJump) {
            velocity.y = 0.2;
            canJump = false;
        }

        if (pos.distanceTo(goal.position) < 2) {
            alert("🎉 Du hast das Ziel erreicht!");
            controls.unlock();
        }
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
