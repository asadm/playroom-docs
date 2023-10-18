import {
  AccumulativeShadows,
  RandomizedLight,
  useGLTF,
} from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo } from "react";

export const Map = () => {
  const map = useGLTF("models/map.glb");
  useEffect(() => {
    map.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  });
  const shadows = useMemo(
    () => (
      <AccumulativeShadows
        temporal
        frames={42}
        alphaTest={0.85}
        scale={40}
        position={[0, 0.1, 0]}
        color="white"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.38}
          ambient={0.5}
          position={[20, 12, -20]}
          size={40}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-20, 8, -20]}
          size={40}
        />
      </AccumulativeShadows>
    ),
    [map]
  );
  return (
    <RigidBody colliders="trimesh" type="fixed">
      <primitive object={map.scene} />
      {shadows}
    </RigidBody>
  );
};
useGLTF.preload("models/map.glb");
