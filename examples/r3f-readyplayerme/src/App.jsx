import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import {insertCoin, myPlayer} from "playroomkit";
import { AvatarCreator } from "@readyplayerme/react-avatar-creator";
import { useEffect, useState } from "react";
import { generateRandomHexColor, generateRandomPosition } from "./common/map";
import { UI } from "./components/UI";
import Lobby from "./Lobby";

function App(){
  const [roomCode, setRoomCode] = useState(null);
  const [avatarMode, setAvatarMode] = useState(false);
  const [gameLaunched, setGameLaunched] = useState(false);

  if (!avatarMode && !gameLaunched){
    // home page
    return (
      <Lobby onJoinOrCreateRoom={(roomCode)=>{
        setRoomCode(roomCode);
        setAvatarMode(true);
      }} />
    )
  }
  else if (!gameLaunched && avatarMode){
    // show avatar creator
    return (
        <AvatarCreator
          subdomain="wawa-sensei-tutorial"
          className="fixed top-0 left-0 z-10 w-screen h-screen"
          onAvatarExported={(event) => {
            const avatarUrl = event.data.url;
            // join or create the room now.
            insertCoin({
              skipLobby: true, // skip the lobby UI and join/create the room directly
              roomCode: roomCode,
            }).then(() => {
              myPlayer().setState('character', {
                id: myPlayer().id,
                hairColor: generateRandomHexColor(),
                topColor: generateRandomHexColor(),
                bottomColor: generateRandomHexColor(),
                // set the avatar url and add a timestamp to it to avoid caching
                avatarUrl: avatarUrl.split("?")[0] + "?" + new Date().getTime(),
              });

              myPlayer().setState('position', generateRandomPosition());
              setAvatarMode(false);
              setGameLaunched(true);
            });
          }}
        />
    )
  }
  else if (gameLaunched){
    // show the game
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
  
}

export default App;
