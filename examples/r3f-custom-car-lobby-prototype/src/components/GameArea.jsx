import { Gltf, useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";

export const GameArea = () => {
  // const { scene } = useGLTF("/models/map_buildings.glb");
  return (
    <group>
      <Gltf src="/models/map_buildings.glb" />
      <mesh rotation-x={degToRad(-90)} position-y={0.05}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
};

// useGLTF.preload("/models/map.glb");
useGLTF.preload("/models/map_buildings.glb");
useGLTF.preload("/models/map_road.glb");
