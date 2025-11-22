import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(400, 200); // Tamanho fixo do retângulo
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

// ✅ Adiciona o canvas dentro do retângulo verde
document.getElementById('canvas-container').appendChild(renderer.domElement);

// === Scene ===
const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(50, 900 / 450, 0.1, 1000);
camera.position.set(3, 3, 5); 

// === Orbit Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 6;
controls.minPolarAngle = Math.PI / 12;    
controls.maxPolarAngle = Math.PI / 12;  
controls.minAzimuthAngle = -Math.PI / 12; 
controls.maxAzimuthAngle = Math.PI / 12;  
controls.target.set(0, 0, 0);
controls.update();
// === Luz ambiente ===
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// === Carrega o modelo GLTF ===
const loader = new GLTFLoader().setPath('https://lotunos.github.io/Portifolio/nave/');
let model;

loader.load(
  'nave.gltf',
  (gltf) => {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    model.scale.set(0.2, 0.2, 0.2);
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    model.position.set(
      -center.x+1.2,
      -center.y,
      -center.z 
    );     
    controls.target.set(0, 0, 0);
    controls.update();
    model.rotation.set(
        -0.5,   
        0,  
        0    
  );
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('Erro ao carregar modelo:', error);
  }
);
// === Animação com rotação contínua ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (model) {
    model.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
animate();
