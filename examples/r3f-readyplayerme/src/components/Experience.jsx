import { Environment, OrbitControls, useCursor } from "@react-three/drei";
import { findPath, map } from "../common/map";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { Suspense, useRef, useState } from "react";
import { useGrid } from "../hooks/useGrid";
import { Avatar } from "./Avatar";
import { Item } from "./Item";
import { myPlayer, usePlayersState } from "playroomkit";

export const Experience = () => {
  const characters = usePlayersState("character");
  // const [characters] = useAtom(charactersAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const { vector3ToGrid, gridToVector3 } = useGrid();

  const scene = useThree((state) => state.scene);
  const user = myPlayer().id;

  const onPlaneClicked = (e) => {
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }

    const path = findPath(vector3ToGrid(character.position), vector3ToGrid(e.point));
    if (!path) {
      return;
    }

    // const newCharacter  = {...myPlayer().getState('character'), path, position: path};
    myPlayer().setState('path', path);
    myPlayer().setState('position', vector3ToGrid(character.position));
  };

  const controls = useRef();

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[-4, 4, -4]}
        castShadow
        intensity={0.35}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach={"shadow-camera"}
          args={[-map.size[0], map.size[1], 10, -10]}
          far={map.size[0] + map.size[1]}
        />
      </directionalLight>
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={20}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        screenSpacePanning={false}
        enableZoom={true}
      />

      {map.items.map((item, idx) => (
        <Item
          key={`${item.name}-${idx}`}
          item={item}
        />
      ))}

      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onPlaneClicked}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
        receiveShadow
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {characters
        .filter(({state, player}) => state && player.getState('position')) // remove nulls
        .map(({player, state}) => (
        <Suspense key={state.id}>
          <Avatar
            playerState={player}
            position={gridToVector3(player.getState('position'))}
            hairColor={state.hairColor}
            topColor={state.topColor}
            bottomColor={state.bottomColor}
            avatarUrl={state.avatarUrl}
          />
        </Suspense>
      ))}
    </>
  );
};
