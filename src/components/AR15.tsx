import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

//https://gltf.pmnd.rs/

export function AR15(props: any) {
  const { nodes, materials } = useGLTF('/ar-15-highcustom/ar-15-highcustom.gltf')
  const [selectedObject, setSelectedObject ] = useState<THREE.Object3D | null>(null);
  const { camera, scene, gl } = useThree();
  const mouse = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()


  const handleMouseMove = (event: MouseEvent):void => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  const handleMouseClick = (event: MouseEvent):void => {
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if(intersects.length > 0) {
      setSelectedObject(intersects[0].object)
    } else {
      setSelectedObject(null)
    }
  }

  const handleMouseUp = (event: MouseEvent):void => {
    setSelectedObject(null)
  }

  useEffect(() => {

    const canvas = gl.domElement
    canvas.addEventListener('click', handleMouseClick)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('click', handleMouseClick)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl.domElement])

  useFrame(() => {
    if (selectedObject) {
      
      raycaster.setFromCamera(mouse, camera);
      
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); 
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, intersection);

      selectedObject.position.copy(intersection);
    }
  })
  
  return (
<group {...props} dispose={null}>
      <group scale={0.01}>
        <group position={[34.577, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['AR_IN_A_CASE_BARREL&GASBLOCK_0'].geometry}
            material={materials.BARRELGASBLOCK}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_BCG_0.geometry}
            material={materials.material}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_BUFFER_TUBE_0.geometry}
            material={materials.BUFFER_TUBE}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_HANDGUARD_AEROKNOX_0.geometry}
            material={materials.HANDGUARD_AEROKNOX}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_Lower_receiver_0.geometry}
            material={materials.Lower_receiver}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_MBUS_PRO_0.geometry}
            material={materials.MBUS_PRO}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_Pmag_30_0.geometry}
            material={materials.Pmag_30}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_ROMEO8T_0.geometry}
            material={materials.ROMEO8T}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_SKELETONIZED_GRIPS_0.geometry}
            material={materials.SKELETONIZED_GRIPS}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_SLING_0.geometry}
            material={materials.SLING}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_Upper_0.geometry}
            material={materials.Upper}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.AR_IN_A_CASE_VIPER_STOCK_0.geometry}
            material={materials.VIPER_STOCK}
          />
        </group>
        <group position={[31.401, 37.234, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.LOWER_BUFFER_TUBE_0.geometry}
            material={materials.BUFFER_TUBE}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.LOWER_Lower_receiver_0.geometry}
            material={materials.Lower_receiver}
          />
        </group>
        <group position={[31.401, 37.234, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes['UPPER_BARREL&GASBLOCK_0'].geometry}
            material={materials.BARRELGASBLOCK}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.UPPER_Upper_0.geometry}
            material={materials.Upper}
          />
        </group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.AR_Pmag_30_Pmag_30_0.geometry}
          material={materials.Pmag_30}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['BARREL_BARREL&GASBLOCK_0'].geometry}
          material={materials.BARRELGASBLOCK}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BCG_BCG_0.geometry}
          material={materials.material}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.BOLT_CATCH_Lower_receiver_0.geometry}
          material={materials.Lower_receiver}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.CHARGING_HANDLE_Upper_0.geometry}
          material={materials.Upper}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.DUST_COVER_Upper_0.geometry}
          material={materials.Upper}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.FOREGRIP_SKELETONIZED_GRIPS_0.geometry}
          material={materials.SKELETONIZED_GRIPS}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.FORWARD_ASSIST_Upper_0.geometry}
          material={materials.Upper}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.GRIP_SKELETONIZED_GRIPS_0.geometry}
          material={materials.SKELETONIZED_GRIPS}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.HANDGUARD_HANDGUARD_AEROKNOX_0.geometry}
          material={materials.HANDGUARD_AEROKNOX}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MAG_RELEASE_Lower_receiver_0.geometry}
          material={materials.Lower_receiver}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MBUS_PRO_FINAL_FRONT_MBUS_PRO_0.geometry}
          material={materials.MBUS_PRO}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.MBUS_PRO_FINAL_REAR_MBUS_PRO_0.geometry}
          material={materials.MBUS_PRO}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.ROMEO8T_ROMEO8T_0.geometry}
          material={materials.ROMEO8T}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SAFETY_Lower_receiver_0.geometry}
          material={materials.Lower_receiver}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.SLING_SLING_0.geometry}
          material={materials.SLING}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.STOCK_VIPER_STOCK_0.geometry}
          material={materials.VIPER_STOCK}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.TRIGGER_GROUP_Lower_receiver_0.geometry}
          material={materials.Lower_receiver}
          position={[31.401, 37.234, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={100}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/ar-15-highcustom.gltf')
