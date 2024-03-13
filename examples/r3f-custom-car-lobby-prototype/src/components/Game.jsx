import { Environment, Gltf, Lightformer } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Joystick, onPlayerJoin } from "playroomkit";
import { useEffect, useState } from "react";
import { CarController } from "./CarController";
import { GameArea } from "./GameArea";

export const Game = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    onPlayerJoin((state) => {
      const controls = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "Respawn", label: "Spawn" }],
      });
      const newPlayer = { state, controls };
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  return (
    <group>
      <ambientLight intensity={0.4} />
      <Environment>
        <Lightformer
          position={[5, 5, 5]}
          form="rect" // circle | ring | rect (optional, default = rect)
          intensity={1} // power level (optional = 1)
          color="white" // (optional = white)
          scale={[10, 10]} // Scale it any way you prefer (optional = [1, 1])
          target={[0, 0, 0]} // Target position (optional = undefined)
        />
      </Environment>
      <pointLight position={[0, 5, 0]} intensity={2.5} distance={10} />
      <pointLight
        position={[5, 5, 0]}
        intensity={10.5}
        distance={10}
        color="pink"
      />
      <pointLight
        position={[-5, 5, 0]}
        intensity={10.5}
        distance={15}
        color="blue"
      />
      <directionalLight position={[10, 10, 10]} intensity={0.4} />
      <Physics>
        {players.map(({ state, controls }) => (
          <CarController key={state.id} state={state} controls={controls} />
        ))}
        <RigidBody type="fixed" colliders="hull" rotation-y={Math.PI}>
          <GameArea />
        </RigidBody>
        <RigidBody
          type="fixed"
          sensor
          colliders={false}
          position-y={-5}
          name="void"
        >
          <CuboidCollider args={[20, 3, 20]} />
        </RigidBody>
        <Gltf src="/models/map_road.glb" />
      </Physics>
    </group>
  );
};
