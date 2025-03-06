import * as THREE from 'three';

// Управление выделением и визуальной обратной связью
class HighlightManager {
    private highlightMaterial: THREE.Material;
    private originalMaterials: Map<THREE.Object3D, THREE.Material> = new Map();
    
    constructor() {
        this.highlightMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            opacity: 0.5,
            transparent: true
        });
    }
    
    public highlight(object: THREE.Object3D): void {
        if (object instanceof THREE.Mesh) {
            this.originalMaterials.set(object, object.material);
            object.material = this.highlightMaterial;
        }
    }
    
    public clearHighlight(object: THREE.Object3D): void {
        const originalMaterial = this.originalMaterials.get(object);
        if (originalMaterial && object instanceof THREE.Mesh) {
            object.material = originalMaterial;
            this.originalMaterials.delete(object);
        }
    }

    public outline(object: THREE.Object3D): void {
        
    }
}

export { HighlightManager };