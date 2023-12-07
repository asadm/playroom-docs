import { useCursor, useGLTF } from "@react-three/drei";
// import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../hooks/useGrid";
// import { mapAtom } from "./SocketManager";

export const Item = ({
  item,
  onClick,
}) => {
  const { name, gridPosition, size, rotation } = item;

  const { gridToVector3 } = useGrid();
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  const [hover, setHover] = useState(false);
  useCursor();

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  return (
    <group
      onClick={onClick}
      position={gridToVector3(
        gridPosition,
        width,
        height
      )}>
      <primitive object={clone} rotation-y={((rotation || 0) * Math.PI) / 2} />
    </group>
  );
};
