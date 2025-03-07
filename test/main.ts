import * as THREE from 'three';
import { ModelManager } from './WeaponModelManager.ts';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { WeaponConfigurationSystem } from './WeaponConfigurationSystem.ts';

const canvas = document.querySelector('canvas.threejs') as HTMLCanvasElement;

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1.5, 2, 0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x00000)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(0xffffff, 1, 100, 4, 0.5)
spotlight.position.set(0, 2, 0)
scene.add(spotlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

//

const controls = new OrbitControls(camera, renderer.domElement)
// console.log("every")
// // ground 
// const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
// groundGeometry.rotateX(-Math.PI/2)
// const groundMatretial = new THREE.MeshStandardMaterial({
    
//     color: 'blue',
//     side: THREE.DoubleSide
// })
// const groundMesh = new THREE.Mesh(groundGeometry, groundMatretial)
// scene.add(groundMesh)


// const tableTex = new THREE.TextureLoader().load("/parsons_table/textures/Walnut_diffuse.jpeg");
// tableTex.wrapS = tableTex.wrapT = THREE.RepeatWrapping;
// tableTex.repeat.set(2, 2); 


// const loader = new GLTFLoader()

const main = new WeaponConfigurationSystem(camera, scene)
main.init()

// const modelManager = new ModelManager(scene)
// modelManager.loadInitialModels()
// Load GLTF Model
// loader.load(
//     '/parsons_table/scene.gltf',
//     (gltf) => {
//         const content = gltf.scene
//         content.traverse((child) => {
//             if((child as THREE.Mesh).isMesh) {
//                 const mesh = child as THREE.Mesh; // Cast to Mesh

//                 mesh.material = new THREE.MeshStandardMaterial({
//                     map: tableTex
//                 })
// }})
//         content.position.set(0, 1, 0)
//         scene.add(content);
        
//     },
//     (xhr) => {
//         console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
//     },
//     (error) => {
//         console.error('An error occurred:', error);
//     }
// );

// loader.load(
//     './AR15_custom_acog/AR15_custom_acog.gltf',
//     (gltf) => {
//         const content = gltf.scene;
//         console.log('AR-15 model loaded:', content);
        
//         content.scale.set(0.01, 0.01, 0.01);
//         content.position.set(0, 1.3, -0.2);
        
//         // Поворачиваем модель
//         content.rotation.order = 'ZYX';
//         content.rotation.x = 0;
//         content.rotation.y = Math.PI/2;
//         content.rotation.z = Math.PI/2;
        
//         scene.add(content);
//     },
//     (xhr) => {
//         console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
//     },
//     (error) => {
//         console.error('An error occurred:', error);
//     }
// );
// loader.load(
//     '/green_metal_gun/green_metal_gun.gltf',
//     (gltf) => {
//         const content = gltf.scene;
//         console.log('AR-15 model loaded:', content);
        
//         content.scale.set(0.01, 0.01, 0.01);
//         content.position.set(0, 1.3, -0.2);
        
//         // Поворачиваем модель
//         content.rotation.order = 'ZYX';
//         content.rotation.x = 0;
//         content.rotation.y = Math.PI/2;
//         content.rotation.z = Math.PI/2;
        
//         scene.add(content);
//     },
//     (xhr) => {
//         console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
//     },
//     (error) => {
//         console.error('An error occurred:', error);
//     }
// );


// const modelManger = new ModelManager(scene)
// modelManger.loadModel("../AR15_custom_acog/AR15_custom_acog.gltf")

// resizing and adopting the camera 

// function updateHUD() {
//   camera.left = -window.innerWidth / window.innerHeight;
//   camera.right = window.innerWidth / window.innerHeight;
//   camera.top = 1;
//   camera.bottom = -1;
//   camera.updateProjectionMatrix();
// }
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   updateHUDPositionAndCamera();
// });
animate()

function animate () {
    requestAnimationFrame(animate)
    controls.update();

    renderer.render(scene, camera)
}

window.addEventListener('click', (event) => {
    main.interactionManager.handleClick(event);
});

// // Фасад для удобного использования всей системы
// class WeaponConfigurationSystem {
//     private modelManager: WeaponModelManager;
//     private highlightManager: HighlightManager;
//     private interactionManager: InteractionManager;
//     private weapon: Weapon;
    
//     constructor(scene: THREE.Scene, camera: THREE.Camera) {
//         this.modelManager = new WeaponModelManager(scene);
//         this.highlightManager = new HighlightManager();
//         this.interactionManager = new InteractionManager(
//             scene, 
//             camera, 
//             this.highlightManager
//         );
//     }
    
//     async initialize(baseWeaponPath: string): Promise<void> {
//         await this.modelManager.loadModel(baseWeaponPath, 'base');
//     }
    
//     // API для работы с системой
//     async addAttachment(attachment: AttachmentNode): Promise<boolean> {
//         const weapon = this.findNode(attachment.getName());
//         if (weapon) {
//             weapon.add_attachment(attachment);
//             await this.modelManager.loadModel(attachment.getModelPath(), attachment.getId());
//             return true;
//         }
//         return false;
//     }
// }


// async function setupWeaponConfigurator() {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera();
    
//     const configSystem = new WeaponConfigurationSystem(scene, camera);
//     await configSystem.initialize('models/base_weapon.glb');
    
//     // Обработка событий
//     window.addEventListener('click', (event) => {
//         configSystem.handleInteraction(event);
//     });
// }
export {
    
}