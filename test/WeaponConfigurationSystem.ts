import { InteractionManager } from './InteractionManager.js'
import { ModelManager } from './WeaponModelManager.js'
import { HighlightManager } from './HighlightManager.js';
import { Weapon } from '../src/index.ts';
import * as THREE from 'three';


// facade that 
class WeaponConfigurationSystem {
    public interactionManager : InteractionManager;
    private modelManager: ModelManager;
    public highlightManager: HighlightManager
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
        console.log("init")
        this.modelManager.loadInitialModels()
        
    }
}

export {
    WeaponConfigurationSystem
}