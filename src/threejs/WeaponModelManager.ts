import * as THREE from 'three';
import { GLTFLoader, ThreeMFLoader } from 'three/examples/jsm/Addons.js';


class ModelManager {
    private extractedParts: THREE.Object3D[] = [];
    private scene: THREE.Scene; // Store the Three.js scene reference
    private loader: GLTFLoader;
    private textureLoader: THREE.TextureLoader;
    
    constructor(scene: THREE.Scene) {
        this.textureLoader= new THREE.TextureLoader();
        this.loader = new GLTFLoader();
        this.scene = scene;
    }

    public async loadInitialModels(): Promise<void> {
        // ground 
        const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32)
        groundGeometry.rotateX(-Math.PI/2)
        const groundMatretial = new THREE.MeshStandardMaterial({
            
            color: 'blue',
            side: THREE.DoubleSide
        })
        const groundMesh = new THREE.Mesh(groundGeometry, groundMatretial)

        this.scene.add(groundMesh)
        // loading table and ground
        const table = await this.loadModel("/parsons_table/scene.gltf", "/parsons_table/textures/Walnut_diffuse.jpeg")
        table.attach()
    }

    public async loadModel(modelPath: string, texturePath?: string): Promise<THREE.Group> {
        return new Promise((resolve, reject) => {

            this.loader.load(
                modelPath, (gltf) => {
                    const content = gltf.scene
                    if(texturePath) {
                        const texture = this.textureLoader.load(texturePath)
                        content.traverse((child) => {
                            if(child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshStandardMaterial({
                                    map: texture
                                })

                            }
                        })
                    }
                    this.scene.add(content)
                    resolve(content)
                },
                (xhr) => {
                    console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`)
                },
                (error) => {
                    reject(error)
                }
            );
        }
    )};

    // Object3d.traverse(callback: function)
    // Recursive function to extract meaningful parts
    public extractParts(group: THREE.Group, parentName: string = ''): void {
        group.children.forEach(child => {
            if (child instanceof THREE.Group) {
                // Recursively process sub-groups
                this.extractParts(child, child.name || parentName);
            } else if (child instanceof THREE.Object3D) {
                // If it's a mesh, store it as a usable part
                if (this.isValidPart(child)) {
                    this.extractedParts.push(child.clone());
                    console.log(`Extracted: ${child.name} from ${parentName}`);
                }
            }
        });
    }

    // Function to determine if a part should be included
    private isValidPart(child: THREE.Object3D): boolean {
        return true
    }

    // Function to arrange extracted parts in space for display
    public async arrangeParts(): Promise<void> {
        let xOffset = 0;
        
        this.extractedParts.forEach((part) => {
            part.scale.set(0.01, 0.01, 0.01);
            part.position.set(xOffset, 1.3, -0.2);
            
            // Поворачиваем модель
            part.rotation.order = 'ZYX';
            part.rotation.x = 0;
            part.rotation.y = Math.PI/2;
            part.rotation.z = Math.PI/2; // Spread parts along the X-axis
            this.scene.add(part); // ✅ Add the extracted part to the Three.js scene
            console.log(part)
            xOffset += 5; // Move each part further in the X-axis
        });
    }

    // Call this method to process the model
    public processModel(): void {

    }
}

export {
    ModelManager
}