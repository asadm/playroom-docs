import { Environment } from "@react-three/drei";
import {
  Joystick,
  insertCoin,
  isHost,
  myPlayer,
  onPlayerJoin,
  useMultiplayerState,
} from "playroomkit";
import { useEffect, useState } from "react";
import { Bullet } from "./Bullet";
import { BulletHit } from "./BulletHit";
import { CharacterController } from "./CharacterController";
import { Map } from "./Map";

export const Experience = ({ downgradedPerformance = false }) => {
  const [players, setPlayers] = useState([]);
  const start = async () => {
    // Start the game
    await insertCoin({matchmaking: true, maxPlayersPerRoom: 8});

    // Create a joystick controller for each joining player
    onPlayerJoin((state) => {
      // Joystick will only create UI for current player (myPlayer)
      // For others, it will only sync their state
      const joystick = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "fire", label: "Fire" }],
      });
      const newPlayer = { state, joystick };
      state.setState("health", 100);
      state.setState("deaths", 0);
      state.setState("kills", 0);
      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  };

  useEffect(() => {
    start();
  }, []);

  const [bullets, setBullets] = useState([]);
  const [hits, setHits] = useState([]);

  const [networkBullets, setNetworkBullets] = useMultiplayerState(
    "bullets",
    []
  );
  const [networkHits, setNetworkHits] = useMultiplayerState("hits", []);

  const onFire = (bullet) => {
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId, position) => {
    setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position }]);
  };

  const onHitEnded = (hitId) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
  };

  useEffect(() => {
    setNetworkBullets(bullets);
  }, [bullets]);

  useEffect(() => {
    setNetworkHits(hits);
  }, [hits]);

  const onKilled = (_victim, killer) => {
    const killerState = players.find((p) => p.state.id === killer).state;
    killerState.setState("kills", killerState.state.kills + 1);
  };

  return (
    <>
      <Map />
      {players.map(({ state, joystick }, index) => (
        <CharacterController
          key={state.id}
          state={state}
          userPlayer={state.id === myPlayer()?.id}
          joystick={joystick}
          onKilled={onKilled}
          onFire={onFire}
          downgradedPerformance={downgradedPerformance}
        />
      ))}
      {(isHost() ? bullets : networkBullets).map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}
      {(isHost() ? hits : networkHits).map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
