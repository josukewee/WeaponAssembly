import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;

// Scene, Camera, Renderer
const sceen = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x00000)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
sceen.add(ambientLight);

const spotlight = new THREE.SpotLight(0xffffff, 3, 100, 4, 0.5)
spotlight.position.set(0, 2, 0)
sceen.add(spotlight);

// ground 
const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
groundGeometry.rotateX(-Math.PI/2)
const groundMatretial = new THREE.MeshStandardMaterial({
    color: 'blue',
    side: THREE.DoubleSide
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMatretial)
sceen.add(groundMesh)

animate()
// Load GLTF Model
const loader = new GLTFLoader().setPath('public/parsons_table')
loader.load(
    '/scene.gltf',
    (gltf) => {
        const mesh = gltf.scene
        mesh.position.set(0, 1, 0)
        sceen.add(mesh);
    },
    (xhr) => {
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('An error occurred:', error);
    }
);

function animate () {
    requestAnimationFrame(animate)
    renderer.render(sceen, camera)
}
// Add a test cube
