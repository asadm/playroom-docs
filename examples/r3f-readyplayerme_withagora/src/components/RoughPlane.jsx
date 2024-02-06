import { RigidBody } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export const RoughPlane = () => {
  // Load models
  const roughPlane = useGLTF("roughPlane.glb");

  useEffect(() => {
    // Receive Shadows
    roughPlane.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        child.receiveShadow = true;
      }
    });
  }, []);

  return (
    <RigidBody type="fixed" colliders="trimesh" position={[0, -1.2, 0]}>
      <primitive object={roughPlane.scene} />
    </RigidBody>
  );
}

useGLTF.preload("roughPlane.glb")