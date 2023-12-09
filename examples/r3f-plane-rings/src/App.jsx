import React, { useEffect, useState } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Landscape } from "./Landscape";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";
import { Joystick, insertCoin, myPlayer, usePlayersList } from "playroomkit";

function App() {
  const [coinInserted, setCoinInserted] = useState(false);
  useEffect(() => {
    insertCoin().then(() => {
      setCoinInserted(true);
    });
  }, []);

  if (!coinInserted) {
    return null;
  }
  return (
    <Scene />
  );
}

function Scene(){
  const players = usePlayersList();
  const [joystick, setJoystick] = useState();

  useEffect(() => {
    if (!joystick){
      setJoystick(new Joystick(myPlayer(), {
        type: "angular",
        buttons: [
          {id: "boost", label: "Boost"},
          {id: "reset", label: "Reset"}
        ]
      }));
    }
  }, [joystick]);

  return (
    <>
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />

      <PerspectiveCamera makeDefault position={[0, 10, 10]} />

      <Landscape />
      {players.map((player) => 
        <Airplane key={player.id} player={player} joystick={player.id===myPlayer().id? joystick: undefined} />
      )}
      <Targets />

      <directionalLight
        castShadow
        color={"#f3d29a"}
        intensity={2}
        position={[10, 5, 4]}
        shadow-bias={-0.0005}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.01}
        shadow-camera-far={20}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6.2}
        shadow-camera-right={6.4}
      />

      <EffectComposer>
        <MotionBlur />
        <HueSaturation
          blendFunction={BlendFunction.NORMAL} // blend mode
          hue={-0.15} // hue in radians
          saturation={0.1} // saturation in radians
        />
      </EffectComposer>
    </>
  );
}

export default App;
