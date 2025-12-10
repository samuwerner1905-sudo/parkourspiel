// Basic Three.js Setup
const canvas = document.getElementById("game");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#87CEEB");

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10,20,10);
scene.add(light);

// Player
const playerGeo = new THREE.BoxGeometry(1,2,1);
const playerMat = new THREE.MeshStandardMaterial({color: "#ff4444"});
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.y = 1;
scene.add(player);

// Ground
const groundGeo = new THREE.PlaneGeometry(500, 20);
const groundMat = new THREE.MeshStandardMaterial({color: "#228B22"});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI/2;
scene.add(ground);

// Trees
for (let i=0; i<30; i++){
  let trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3,0.3,3,8),
    new THREE.MeshStandardMaterial({color:"#8B4513"})
  );
  trunk.position.set(i*15,1.5,-4 + (Math.random()*8-4));
  scene.add(trunk);
  let leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2,16,16),
    new THREE.MeshStandardMaterial({color:"#2E8B57"})
  );
  leaves.position.set(trunk.position.x,4,trunk.position.z);
  scene.add(leaves);
}

// Goal
const goalGeo = new THREE.BoxGeometry(4,4,4);
const goalMat = new THREE.MeshStandardMaterial({color:"#ffff00"});
const goal = new THREE.Mesh(goalGeo, goalMat);
goal.position.set(450,2,0);
scene.add(goal);

let velY = 0;
let isJumping = false;

let moveX = 0;

// Jump Button
document.getElementById("jumpBtn").addEventListener("touchstart", () => {
  if (!isJumping){
    velY = 0.25;
    isJumping = true;
  }
});

// Simple Loop
function loop(){
  velY -= 0.01;
  player.position.y += velY;

  if (player.position.y <= 1){
    player.position.y = 1;
    isJumping = false;
  }

  player.position.x += moveX * 0.1;

  camera.position.set(player.position.x - 5, 4, 10);
  camera.lookAt(player.position);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
loop();
