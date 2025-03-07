import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Table(props: any) {
  const { nodes, materials } = useGLTF('/for_real_table/for_real_table.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow={true}
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials.Walnut}
        position={[0, 0.03, 0]}
      />
    </group>
  )
}

useGLTF.preload('/for_real_table.gltf')