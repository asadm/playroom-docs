"use client";

import { useEffect } from "react";
import { insertCoin, myPlayer, usePlayersList } from "playroomkit";

import Cursor from "../components/Cursor";
import styles from "./index.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlayerLite = { id: string; getState: (key: string) => any };

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#cbb913",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

const colorForId = (id: string) =>
  COLORS[id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % COLORS.length];

export default function Home() {
  useEffect(() => {
    insertCoin();
  }, [])

  const players = usePlayersList(true) as PlayerLite[];
  const me = myPlayer();

  const myCursor = players.find((p) => p.id === me?.id)?.getState("cursor") as
    | { x: number; y: number }
    | null
    | undefined;

  const statusText = !me
    ? "Waiting for Playroom to initialize..."
    : myCursor
      ? `${myCursor.x} × ${myCursor.y}`
      : "Move your cursor to broadcast its position to other people in the room.";

  return (
    <main
      className={styles.container}
      onPointerMove={(event) => {
        if (me?.setState) me.setState("cursor", { x: Math.round(event.clientX), y: Math.round(event.clientY) }, false);
      }}
      onPointerLeave={() => {
        if (me?.setState) me.setState("cursor", null, false);
      }}
    >
      <div className={styles.text}>{statusText}</div>

      {players
        .filter((player) => player.id !== me?.id)
        .map((player) => {
          const playerCursor = player.getState("cursor");
          if (!playerCursor) return null;
          return <Cursor key={`cursor-${player.id}`} color={colorForId(player.id)} x={playerCursor.x} y={playerCursor.y} />;
        })}
    </main>
  );
}