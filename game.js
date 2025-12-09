let scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff,1);
light.position.set(20,50,20);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

let floor = new THREE.Mesh(new THREE.BoxGeometry(200,1,200), new THREE.MeshStandardMaterial({color:0x228b22}));
floor.position.y=-0.5; scene.add(floor);

let platforms=[];
function createPlatform(x,y,z,w=5,h=1,d=5){
  let p = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial({color:0x888888}));
  p.position.set(x,y,z); scene.add(p); platforms.push(p);
}
for(let i=0;i<15;i++){
  createPlatform(Math.random()*10-5,i*1.5,-i*8);
}

let goal = new THREE.Mesh(new THREE.BoxGeometry(4,4,4), new THREE.MeshStandardMaterial({color:0xff0000}));
goal.position.set(0,22,-120); scene.add(goal);

let player = new THREE.Object3D(); player.position.set(0,1.5,0); scene.add(player);
camera.position.set(0,2,5); camera.lookAt(player.position);

let velocityY=0, canJump=true, move={forward:false,left:false,right:false};

document.getElementById('forward').addEventListener('touchstart',()=>move.forward=true);
document.getElementById('forward').addEventListener('touchend',()=>move.forward=false);
document.getElementById('left').addEventListener('touchstart',()=>move.left=true);
document.getElementById('left').addEventListener('touchend',()=>move.left=false);
document.getElementById('right').addEventListener('touchstart',()=>move.right=true);
document.getElementById('right').addEventListener('touchend',()=>move.right=false);
document.getElementById('jump').addEventListener('touchstart',()=>{if(canJump){velocityY=0.25; canJump=false;}});

function animate(){
  requestAnimationFrame(animate);
  if(move.forward) player.position.z-=0.1;
  if(move.left) player.position.x-=0.1;
  if(move.right) player.position.x+=0.1;
  velocityY-=0.01; player.position.y+=velocityY;
  let onPlatform=false;
  for(let p of platforms){
    if(Math.abs(player.position.x-p.position.x)<2.5 && Math.abs(player.position.z-p.position.z)<2.5){
      if(player.position.y <= p.position.y +1){ player.position.y=p.position.y+1; velocityY=0; canJump=true; onPlatform=true; }
    }
  }
  if(player.position.y<1.5 && !onPlatform){player.position.y=1.5; velocityY=0; canJump=true;}
  camera.position.x=player.position.x; camera.position.z=player.position.z+5; camera.position.y=player.position.y+1;
  camera.lookAt(player.position);
  if(player.position.distanceTo(goal.position)<2){ alert('🎉 Du hast das Ziel erreicht!'); player.position.set(0,1.5,0); velocityY=0; }
  renderer.render(scene,camera);
}
animate();
window.addEventListener('resize',()=>{ camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth,window.innerHeight); });