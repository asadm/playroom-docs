import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import {insertCoin, myPlayer} from "playroomkit";
import { useEffect, useState } from "react";
import { generateRandomHexColor, generateRandomPosition } from "./common/map";
import { UI } from "./components/UI";

function App() {
  const [gameLaunched, setGameLaunched] = useState(false);
  useEffect(() => {
    insertCoin().then(() => {
      myPlayer().setState('character', {
        id: myPlayer().id,
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
        avatarUrl: "https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb",
      });
      myPlayer().setState('position', generateRandomPosition());
      setGameLaunched(true);
    });
  }, []);
  
  if (!gameLaunched) {
    return null;
  }

  return (
    <>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={0}>
          <Experience />
        </ScrollControls>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
