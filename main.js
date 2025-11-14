import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// === Scene ===
const scene = new THREE.Scene();

// === Camera ===
const camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000);
camera.position.set(10, 8, 15);

// === Orbit Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 4, 0.3);
spotLight.position.set(15, 40, 25);
spotLight.castShadow = true;
scene.add(spotLight);

// === Ground ===
const groundGeometry = new THREE.PlaneGeometry(15, 15);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);

// === Load GLTF ===
const loader = new GLTFLoader().setPath('./nave/');
let model;
loader.load('nave.gltf', (gltf) => {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Ajuste de escala base
  model.scale.set(0.5, 0.5, 0.5);

  // ✅ Rotação do modelo (90° no eixo Y)
  model.rotation.y = Math.PI / 2;

  scene.add(model);

  // === Centraliza e enquadra automaticamente ===
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  model.position.x += model.position.x - center.x + 2;
  model.position.y += model.position.y - center.y + 2;
  model.position.z += model.position.z - center.z;

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
  cameraZ *= 1.5;

  camera.position.set(center.x + cameraZ, center.y + maxDim * 0.4, center.z + cameraZ);
  camera.lookAt(center);

  controls.target.copy(center);
  controls.update();
});

undefined,
(error) => {
    console.error('Erro ao carregar modelo:', error);
}
// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate com rotação contínua
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Rotação contínua do modelo
  if (model) {
    model.rotation.y += 0.005; // velocidade de rotação
  }

  renderer.render(scene, camera);
}
animate();
