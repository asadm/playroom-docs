import { CodePlaygroundFile } from "../components/CodePlayground";

export const liveCursorsExampleFiles: CodePlaygroundFile[] = [
  {
    name: "app/page.tsx",
    language: "typescript",
    code: `"use client";

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
      ? \`\${myCursor.x} × \${myCursor.y}\`
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
          return <Cursor key={\`cursor-\${player.id}\`} color={colorForId(player.id)} x={playerCursor.x} y={playerCursor.y} />;
        })}
    </main>
  );
}
`,
  },
  {
    name: "app/index.module.css",
    language: "css",
    code: `html {
    font-family: Arial, Helvetica, sans-serif;
}

.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  place-content: center;
  place-items: center;
  touch-action: none;
}

.text {
  max-width: 380px;
  margin: 0 16px;
  text-align: center;
}
`,
  },
  {
    name: "app/layout.tsx",
    language: "typescript",
    code: `export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
`,
  },
  {
    name: "components/Cursor.tsx",
    language: "typescript",
    code: `type Props = {
  color: string;
  x: number;
  y: number;
};

export default function Cursor({ color, x, y }: Props) {
  const SCALE = 2.5;

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: \`translateX(\${x}px) translateY(\${y}px) scale(\${SCALE})\`,
        transformOrigin: "0 0",
      }}
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
        fill={color}
      />
    </svg>
  );
}
`
  }
];
