import { Environment, OrbitControls } from "@react-three/drei";
import { isStreamScreen } from "playroomkit";
import { Gameboard } from "./Gameboard";
import { MobileController } from "./MobileController";

export const Experience = () => {
  return (
    <>
      {isStreamScreen() && <OrbitControls />}
      {isStreamScreen() ? <Gameboard /> : <MobileController />}
      <Environment preset="dawn" background blur={2} />
    </>
  );
};
