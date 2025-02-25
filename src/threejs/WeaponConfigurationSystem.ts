import { InteractionManager } from './InteractionManager.js'
import { ModelManager } from './WeaponModelManager.js'
import { HighlightManager } from './HighlightManager.js';
import { Weapon } from '../index.js';
import * as THREE from 'three';


// facade that 
class WeaponConfigurationSystem {
    private interactionManager : InteractionManager;
    private modelManager: ModelManager;
    private highlightManager: HighlightManager
    private weapon?: Weapon 

    constructor(
       public camera: THREE.Camera,
       public scene: THREE.Scene
    ){
        this.modelManager = new ModelManager(scene)
        this.highlightManager = new HighlightManager()
        this.interactionManager = new InteractionManager(scene, camera, this.highlightManager)
    }

    public init(): void {
        this.modelManager.loadInitialModels()
    }
}

export {
    WeaponConfigurationSystem
}