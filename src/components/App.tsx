import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PerspectiveCamera, Vector3 } from 'three';
import { Ground } from './Ground.tsx';
import { AR15 } from './AR15.tsx';
import { Table } from './Table.tsx'
import { Grid } from '@react-three/drei';

export default function App() {
  return (
    <Canvas
      fallback={<div>Sorry no WebGL supported!</div>}
      camera={{
      position: [0, 1.5, 1.5],
      rotation: [0, -Math.PI / 2, 0], // 90 degrees left around Y-axis
      fov: 75,
      near: 0.1,
      far: 1000
  }}
    >
      <OrbitControls 
        minAzimuthAngle={-Math.PI / 2} 
        maxAzimuthAngle={-Math.PI / 2}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Ground />
      <Table></Table>
      <AR15 position ={[-0.25, 0.74, 0]}/>
    </Canvas>
  );
}

