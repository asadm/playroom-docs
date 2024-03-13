import { useMultiplayerState } from "playroomkit";
import { Game } from "./Game";
import { Lobby } from "./Lobby";

export const Experience = () => {
  const [gameState] = useMultiplayerState("gameState", "lobby");
  return (
    <>
      {gameState === "lobby" && <Lobby />}
      {gameState === "game" && <Game />}
    </>
  );
};
