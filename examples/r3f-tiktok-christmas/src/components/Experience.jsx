import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense } from "react";
import { degToRad } from "three/src/math/MathUtils";
import {
  GAMEBOARD_LENGTH,
  SNOWMAN_COLUMNS,
  SNOWMAN_SPACE_COLUMN,
  SNOWMAN_SPACE_ROW,
} from "../App";
import { useGame } from "../hooks/useGame";
import { Explosion } from "./Explosion";
import { Final } from "./Final";
import { Gameboard } from "./Gameboard";
import { Grave } from "./Grave";
import { Santa } from "./Santa";
import { Snowman } from "./Snowman";
export const Experience = () => {
  const { snowmen, status, showBomb } = useGame();
  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <directionalLight
        position={[10, 8, 20]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      >
        <PerspectiveCamera
          attach={"shadow-camera"}
          near={1}
          far={50}
          fov={80}
        />
      </directionalLight>

      <Final
        position-y={-2}
        rotation-x={degToRad(-20)}
        visible={status === "gameover"}
      />
      <group visible={status === "playing"}>
        {/* TO PREVENT THE GAMEBOARD FROM HAVING A WRONG POSITION WHEN THE GAME STARTS AS THE LOGIC IS RUNNING */}
        <Gameboard position-z={status === "start" ? 42 : 0} />
        <Gameboard position-z={status === "start" ? 42 : GAMEBOARD_LENGTH} />
        <Gameboard position-z={status === "start" ? 42 : -GAMEBOARD_LENGTH} />
        {showBomb && <Explosion />}
        {snowmen.map((snowman, index) => {
          const column = index % SNOWMAN_COLUMNS;
          const row = Math.floor(index / SNOWMAN_COLUMNS);
          const xPos =
            column * SNOWMAN_SPACE_COLUMN -
            ((SNOWMAN_COLUMNS - 1) * SNOWMAN_SPACE_COLUMN) / 2;
          return (
            <group
              key={index}
              position-z={-1 - row * SNOWMAN_SPACE_ROW}
              position-x={xPos}
            >
              {snowman.dead && (
                <Suspense>
                  <Grave
                    position-y={1}
                    position-z={-0.5}
                    player={snowman.killedBy}
                  />
                </Suspense>
              )}
              <Snowman snowman={snowman} />
            </group>
          );
        })}
        <Santa position-z={6} />
      </group>
    </>
  );
};
