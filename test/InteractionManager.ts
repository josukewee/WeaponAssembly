import * as THREE from 'three';
import { AttachmentNode } from '../src/index.ts';
import { HighlightManager } from './HighlightManager.js';


class InteractionManager {
    private raycaster: THREE.Raycaster;
    private selectedPart: THREE.Mesh | null = null;
    
    constructor(
        private scene: THREE.Scene,
        private camera: THREE.Camera,
        private highlightManager: HighlightManager
    ) {
        this.raycaster = new THREE.Raycaster();
    }
    

    public handleClick(event: MouseEvent): void {
        const intersection = this.getIntersection(event);
        if (intersection) {
            this.onPartClicked(intersection.object);
        }
    }
    private onPartClicked(object: THREE.Object3D): void {
        if (object instanceof THREE.Mesh) {
            this.selectedPart = object;
            this.highlightManager.highlight(object);
        }
    }
    

    private getMousePosition(event: MouseEvent): THREE.Vector2 {
        return new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    }

    private getIntersection(event: MouseEvent): THREE.Intersection | null   {
        const mouse = this.getMousePosition(event);
        console.log(mouse)
        this.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        console.log(intersects[0].object)
        return intersects[0] || null;
    }

}

export {
    InteractionManager
}