import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { GameProvider } from "./hooks/useGame";

export const DEBUG_MODE = false;

export const SNOWMAN_COLUMNS = 4;
export const SNOWMAN_SPACE_COLUMN = 2.5;
export const SNOWMAN_SPACE_ROW = 4;
export const SCROLL_SPEED = 10;
export const GAMEBOARD_LENGTH = 56;

function App() {
  return (
    <GameProvider>
      <Canvas shadows camera={{ position: [0, 8, 12], fov: 90 }}>
        <color attach="background" args={["#333"]} />
        <fog attach={"fog"} args={["#333", 14, 35]} />
        <Experience />
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} luminanceThreshold={1} />
        </EffectComposer>
      </Canvas>
      <UI />
    </GameProvider>
  );
}

export default App;
