import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { myPlayer } from "playroomkit";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  const me = myPlayer();
  return (
    <>
      <UI />
      <Leva hidden />
      <Canvas
        shadows
        camera={{ position: [4.2, 1.5, 7.5], fov: 45, near: 0.5 }}
      >
        <color attach="background" args={["#333"]} />
        <Experience />
        <EffectComposer>
          <Bloom luminanceThreshold={1} intensity={1.22} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
