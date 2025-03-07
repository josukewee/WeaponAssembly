import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export const Ground: React.FC = () => {
    const [groundMesh, setGroundMesh] = useState<THREE.Mesh | null>(null);

    useEffect(() => {
        // Create the ground geometry and material
        const groundGeometry = new THREE.PlaneGeometry(20, 20, 1, 32);
        groundGeometry.rotateX(-Math.PI / 2);

        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 'green',
            side: THREE.DoubleSide,
        });

        // Create the mesh and set it in state
        const mesh = new THREE.Mesh(groundGeometry, groundMaterial);
        console.log('Ground mesh created:', mesh);
        mesh.position.set(0, 0, 0);
        setGroundMesh(mesh);
    }, []);

    // Only render the primitive if groundMesh is defined
    return groundMesh ? <primitive object={groundMesh} /> : null;
};
