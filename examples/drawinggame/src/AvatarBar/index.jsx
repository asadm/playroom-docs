import React from "react";
import AvatarIcon from "./AvatarIcon";
import { usePlayersList, useMultiplayerState } from "playroomkit";
import "./style.css";

export default function AvatarBar() {
  const players = usePlayersList(true);
  const [playerDrawing, _setPlayerDrawing] = useMultiplayerState('playerDrawing');
  return (
    <div
      className="player-avatar-bar">
      {players.map((playerState) => {
        return (
          <div
            key={playerState.id}
            className="player-avatar-container"
            style={{ backgroundColor: playerState.getState("profile")?.color }}>
              {playerState.id === playerDrawing && <div className="drawing"></div>}
              {playerState.getState("guessed") && <div className="guessed"></div>}
              <AvatarIcon playerState={playerState} />
          </div>
        );
      })}
    </div>
  );
}
