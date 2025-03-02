import * as THREE from 'three';
import { GLTFLoader, ThreeMFLoader } from 'three/examples/jsm/Addons.js';


class ModelManager {
    private extractedParts: THREE.Object3D[] = [];
    private scene: THREE.Scene; // Store the Three.js scene reference
    private loader: GLTFLoader;
    private textureLoader: THREE.TextureLoader;
    private groundOffset?: number = this.defineOffset();
    
    constructor(scene: THREE.Scene) {
        this.textureLoader= new THREE.TextureLoader();
        this.loader = new GLTFLoader();
        this.scene = scene;
    }

    private async createGround(): Promise<THREE.Mesh> {
        const groundGeometry = new THREE.PlaneGeometry(20, 20, 1, 32)
        groundGeometry.rotateX(-Math.PI/2)
        const groundMatretial = new THREE.MeshStandardMaterial({
            
            color: 'white',
            side: THREE.DoubleSide
        })
        const groundMesh = new THREE.Mesh(groundGeometry, groundMatretial)
        groundMesh.position.set(0, 0, 0)
        return groundMesh;
    }

    private defineOffset(model: THREE.Object3D, isMin: boolean): THREE.Vector3{
        // axes helper(it;s like a tool to help orientate in the space)

        const boundingBox = new THREE.Box3().setFromObject(model);
        
        return isMin ? boundingBox.min : boundingBox.max
    }


    

    public async loadInitialModels(): Promise<void> {
        // ground (resolved return the mesh itself)
        const ground = await this.createGround();

        const table = await this.loadModel("/parsons_table/scene.gltf", "/parsons_table/textures/Walnut_diffuse.jpeg")

        const groundOffset = this.defineOffset(ground, true)

        // boundindBox is a cool tool to attach some 
        const axesHelper = new THREE.AxesHelper(10); // Adjust length as needed
        table.position.set(0, -groundOffset.y, 0)
        this.scene.add(ground)
        this.scene.add(table)
        this.scene.add(axesHelper);

    }

    public async loadModel(modelPath: string, texturePath?: string): Promise<THREE.Group> {
        const content = await this.loader.loadAsync(modelPath, (xhr) => {
            console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        })
        if(texturePath && content) {
            const texture = await this.textureLoader.loadAsync(texturePath, (xhr) => {
                console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
            })
            content.scene.traverse((child) => {
                if(child instanceof THREE.Mesh) {
                    const newMaterial = texture.clone()
                    child.material = new THREE.MeshStandardMaterial({
                        map: newMaterial
                    })
                }

            })
        }
        return content.scene

        };
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
    // if some ui recquires
    // public getGroundOffset(): number | null { 
    //     return this.groundOffset ?? null
    // }
}

export {
    ModelManager
}