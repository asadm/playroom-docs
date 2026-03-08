import { CodePlaygroundFile } from "../components/CodePlayground";

export const liveCanvasExampleFiles: CodePlaygroundFile[] = [
  {
    name: "index.html",
    language: "html",
    code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- TODO: Set the document title to the name of your application -->
    <title>Lovable App</title>
    <meta name="description" content="Lovable Generated Project" />
    <meta name="author" content="Lovable" />

    <!-- TODO: Update og:title to match your application name -->
    <meta property="og:title" content="Lovable App" />
    <meta property="og:description" content="Lovable Generated Project" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Lovable" />
    <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
  },
  {
    name: "src/main.tsx",
    language: "typescript",
    code: `import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);`
  },
  {
    name: "src/App.tsx",
    language: "typescript",
    code: `import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Canvas from "./pages/Canvas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/canvas" element={<Canvas />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;`
  },
  {
    name: "src/index.css",
    language: "css",
    code: `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Definition of the design system. All colors, gradients, fonts, etc should be defined here. 
All colors MUST be HSL.
*/

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 98%;

    --sidebar-foreground: 240 5.3% 26.1%;

    --sidebar-primary: 240 5.9% 10%;

    --sidebar-primary-foreground: 0 0% 98%;

    --sidebar-accent: 240 4.8% 95.9%;

    --sidebar-accent-foreground: 240 5.9% 10%;

    --sidebar-border: 220 13% 91%;

    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}`
  },
  {
    name: "src/App.css",
    language: "css",
    code: `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}`
  },
  {
    name: "src/vite-env.d.ts",
    language: "typescript",
    code: `/// <reference types="vite/client" />`
  },
  {
    name: "src/pages/Index.tsx",
    language: "typescript",
    code: `import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/canvas');
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
};

export default Index;`
  },
  {
    name: "src/pages/NotFound.tsx",
    language: "typescript",
    code: `import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;`
  },
  {
    name: "src/pages/Canvas.tsx",
    language: "typescript",
    code: `import React, { useState, useCallback } from 'react';
import { DrawingCanvas } from '@/components/canvas/DrawingCanvas';
import { Toolbar } from '@/components/canvas/Toolbar';
import { PlayerList } from '@/components/canvas/PlayerList';
import { TextInput } from '@/components/canvas/TextInput';
import { usePlayroom } from '@/hooks/usePlayroom';
import type { Tool, Point, Stroke } from '@/types/canvas';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const CanvasPage: React.FC = () => {
  const {
    isReady, error, retry, players, strokes, getMyPlayer,
    broadcastStroke, broadcastCursor, clearAllStrokes,
    removeStroke, isHost, cursors,
  } = usePlayroom();

  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [activeColor, setActiveColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [textPlacement, setTextPlacement] = useState<Point | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });

  const me = getMyPlayer();

  const handleStrokeComplete = useCallback((stroke: Stroke) => {
    broadcastStroke(stroke);
  }, [broadcastStroke]);

  const handleCursorMove = useCallback((x: number, y: number) => {
    if (!me) return;
    broadcastCursor({ x, y, playerId: me.id, color: me.color, name: me.name });
  }, [me, broadcastCursor]);

  const handleTextPlace = useCallback((pt: Point) => {
    setTextPlacement(pt);
  }, []);

  const handleTextSubmit = useCallback((text: string) => {
    if (!textPlacement || !me) return;
    const fontSize = Math.max(16, brushSize * 3);
    const stroke: Stroke = {
      id: generateId(),
      tool: 'text',
      points: [],
      color: activeColor,
      size: brushSize,
      playerId: me.id,
      startPoint: { x: textPlacement.x, y: textPlacement.y },
      text,
      fontSize,
    };
    broadcastStroke(stroke);
    setTextPlacement(null);
  }, [textPlacement, me, activeColor, brushSize, broadcastStroke]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <button
            onClick={retry}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Joining room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <DrawingCanvas
        strokes={strokes}
        activeTool={activeTool}
        activeColor={activeColor}
        brushSize={brushSize}
        onStrokeComplete={handleStrokeComplete}
        onStrokeRemove={removeStroke}
        onCursorMove={handleCursorMove}
        cursors={cursors.filter(c => c.playerId !== me?.id).map(({ playerId, ...rest }) => rest)}
        playerId={me?.id || ''}
        onTextPlace={handleTextPlace}
        onViewportChange={setViewport}
      />

      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        activeColor={activeColor}
        onColorChange={setActiveColor}
        brushSize={brushSize}
        onBrushSizeChange={setBrushSize}
        onClear={clearAllStrokes}
        isHost={isHost}
      />

      <PlayerList players={players} myId={me?.id} />

      {textPlacement && (
        <TextInput
          position={textPlacement}
          color={activeColor}
          fontSize={Math.max(16, brushSize * 3)}
          onSubmit={handleTextSubmit}
          onCancel={() => setTextPlacement(null)}
          viewport={viewport}
        />
      )}
    </div>
  );
};

export default CanvasPage;`
  },
  {
    name: "src/lib/utils.ts",
    language: "typescript",
    code: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`
  },
  {
    name: "src/hooks/use-mobile.tsx",
    language: "typescript",
    code: `import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}`
  },
  {
    name: "src/hooks/use-toast.ts",
    language: "typescript",
    code: `import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };`
  },
  {
    name: "src/hooks/usePlayroom.ts",
    language: "typescript",
    code: `import { useState, useEffect, useCallback, useRef } from 'react';
import { insertCoin, onPlayerJoin, myPlayer, isHost, getState, setState } from 'playroomkit';
import type { Stroke, CursorData, PLAYER_COLORS } from '@/types/canvas';

interface PlayerInfo {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  isHost: boolean;
}

export function usePlayroom() {
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [cursors, setCursors] = useState<CursorData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const playerRefs = useRef<any[]>([]);
  const initCalled = useRef(false);

  const init = useCallback(async () => {
    if (initCalled.current) return;
    initCalled.current = true;
    setError(null);
    setIsReady(false);
    try {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out')), 30000)
      );
      await Promise.race([
        insertCoin({
          skipLobby: true,
          allowGamepads: false,
          maxPlayersPerRoom: 10,
        }),
        timeout,
      ]);
      setIsReady(true);
    } catch (err) {
      console.error('Playroom init failed:', err);
      initCalled.current = false;
      setError(err instanceof Error ? err.message : 'Failed to connect to multiplayer session.');
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!isReady) return;

    const playerList: PlayerInfo[] = [];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

    onPlayerJoin((player) => {
      const idx = playerList.length % colors.length;
      const profile = player.getProfile();
      playerList.push({
        id: String(player.id),
        name: String(profile.name || \`Player \${playerList.length + 1}\`),
        color: String(profile.color?.hex || colors[idx]),
        avatar: profile.photo ? String(profile.photo) : undefined,
        isHost: isHost(),
      });
      setPlayers([...playerList]);
      playerRefs.current.push(player);

      player.onQuit(() => {
        const i = playerList.findIndex(p => p.id === player.id);
        if (i !== -1) playerList.splice(i, 1);
        setPlayers([...playerList]);
        playerRefs.current = playerRefs.current.filter(p => p.id !== player.id);
      });
    });
  }, [isReady]);

  const getMyPlayer = useCallback(() => {
    if (!isReady) return null;
    const me = myPlayer();
    if (!me) return null;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const profile = me.getProfile();
    return {
      id: String(me.id),
      name: String(profile.name || 'Me'),
      color: String(profile.color?.hex || colors[0]),
      avatar: profile.photo ? String(profile.photo) : undefined,
      isHost: isHost(),
    };
  }, [isReady]);

  const broadcastStroke = useCallback((stroke: Stroke) => {
    if (!isReady) return;
    const current = getState('strokes') || [];
    const updated = [...current, stroke];
    setState('strokes', updated, true);
  }, [isReady]);

  const broadcastCursor = useCallback((cursor: CursorData) => {
    if (!isReady) return;
    const me = myPlayer();
    if (me) {
      me.setState('cursor', cursor, true);
    }
  }, [isReady]);

  const clearAllStrokes = useCallback(() => {
    if (!isReady || !isHost()) return;
    setState('strokes', [], true);
  }, [isReady]);

  const removeStroke = useCallback((strokeId: string) => {
    if (!isReady) return;
    const current = getState('strokes') || [];
    const updated = current.filter((s: Stroke) => s.id !== strokeId);
    setState('strokes', updated, true);
  }, [isReady]);

  // Listen for stroke and cursor updates
  useEffect(() => {
    if (!isReady) return;
    const pollColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const interval = setInterval(() => {
      const s = getState('strokes');
      if (s) setStrokes(s);

      // Read cursors from all players
      const cursorList: CursorData[] = [];
      for (let i = 0; i < playerRefs.current.length; i++) {
        const player = playerRefs.current[i];
        const cursor = player.getState('cursor');
        if (cursor) {
          const profile = player.getProfile();
          const fallbackColor = pollColors[i % pollColors.length];
          cursorList.push({
            ...cursor,
            color: profile.color?.hex || profile.color?.hexString || fallbackColor,
            name: profile.name || cursor.name,
          });
        }
      }
      setCursors(cursorList);
    }, 50);
    return () => clearInterval(interval);
  }, [isReady]);

  return {
    isReady,
    error,
    retry: init,
    players,
    strokes,
    cursors,
    getMyPlayer,
    broadcastStroke,
    broadcastCursor,
    clearAllStrokes,
    removeStroke,
    isHost: isReady ? isHost() : false,
  };
}`
  },
  {
    name: "src/types/canvas.ts",
    language: "typescript",
    code: `export type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text';

export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  size: number;
  playerId: string;
  // For shapes
  startPoint?: Point;
  endPoint?: Point;
  // For text
  text?: string;
  fontSize?: number;
}

export interface CursorData {
  x: number;
  y: number;
  playerId: string;
  color: string;
  name: string;
}

export interface CanvasState {
  strokes: Stroke[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export const PLAYER_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f59e0b', '#6366f1', '#d946ef',
];

export const BRUSH_SIZES = [2, 4, 8, 12, 20];

export const PALETTE_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#ec4899', '#6b7280', '#92400e',
];`
  },
  {
    name: "src/components/canvas/DrawingCanvas.tsx",
    language: "typescript",
    code: `import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Tool, Point, Stroke } from '@/types/canvas';

interface DrawingCanvasProps {
  strokes: Stroke[];
  activeTool: Tool;
  activeColor: string;
  brushSize: number;
  onStrokeComplete: (stroke: Stroke) => void;
  onStrokeRemove: (strokeId: string) => void;
  onCursorMove: (x: number, y: number) => void;
  cursors: { x: number; y: number; color: string; name: string }[];
  playerId: string;
  onTextPlace: (point: Point) => void;
  onViewportChange?: (viewport: { x: number; y: number; zoom: number }) => void;
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, viewport: { x: number; y: number; zoom: number }) {
  ctx.save();
  ctx.translate(viewport.x, viewport.y);
  ctx.scale(viewport.zoom, viewport.zoom);

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (stroke.tool === 'pen' || stroke.tool === 'eraser') {
    if (stroke.tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = stroke.size * 3;
    }
    if (stroke.points.length < 2) {
      ctx.beginPath();
      ctx.arc(stroke.points[0]?.x || 0, stroke.points[0]?.y || 0, stroke.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const p0 = stroke.points[i - 1];
        const p1 = stroke.points[i];
        const mx = (p0.x + p1.x) / 2;
        const my = (p0.y + p1.y) / 2;
        ctx.quadraticCurveTo(p0.x, p0.y, mx, my);
      }
      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  } else if (stroke.tool === 'line' && stroke.startPoint && stroke.endPoint) {
    ctx.beginPath();
    ctx.moveTo(stroke.startPoint.x, stroke.startPoint.y);
    ctx.lineTo(stroke.endPoint.x, stroke.endPoint.y);
    ctx.stroke();
  } else if (stroke.tool === 'arrow' && stroke.startPoint && stroke.endPoint) {
    const { startPoint: s, endPoint: e } = stroke;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e.x, e.y);
    ctx.stroke();
    // Arrowhead
    const angle = Math.atan2(e.y - s.y, e.x - s.x);
    const headLen = Math.max(stroke.size * 3, 12);
    ctx.beginPath();
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(e.x - headLen * Math.cos(angle - Math.PI / 6), e.y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(e.x, e.y);
    ctx.lineTo(e.x - headLen * Math.cos(angle + Math.PI / 6), e.y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  } else if (stroke.tool === 'rectangle' && stroke.startPoint && stroke.endPoint) {
    const { startPoint: s, endPoint: e } = stroke;
    ctx.strokeRect(s.x, s.y, e.x - s.x, e.y - s.y);
  } else if (stroke.tool === 'circle' && stroke.startPoint && stroke.endPoint) {
    const { startPoint: s, endPoint: e } = stroke;
    const rx = Math.abs(e.x - s.x) / 2;
    const ry = Math.abs(e.y - s.y) / 2;
    const cx = s.x + (e.x - s.x) / 2;
    const cy = s.y + (e.y - s.y) / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (stroke.tool === 'text' && stroke.text && stroke.startPoint) {
    ctx.font = \`\${stroke.fontSize || 16}px sans-serif\`;
    ctx.textBaseline = 'top';
    ctx.fillText(stroke.text, stroke.startPoint.x, stroke.startPoint.y);
  }

  ctx.restore();
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  strokes, activeTool, activeColor, brushSize,
  onStrokeComplete, onStrokeRemove, onCursorMove,
  cursors, playerId, onTextPlace, onViewportChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  const toCanvasCoords = useCallback((clientX: number, clientY: number): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - viewport.x) / viewport.zoom,
      y: (clientY - rect.top - viewport.y) / viewport.zoom,
    };
  }, [viewport]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.save();
      ctx.translate(viewport.x, viewport.y);
      ctx.scale(viewport.zoom, viewport.zoom);
      const gridSize = 40;
      const startX = Math.floor(-viewport.x / viewport.zoom / gridSize) * gridSize - gridSize;
      const startY = Math.floor(-viewport.y / viewport.zoom / gridSize) * gridSize - gridSize;
      const endX = startX + (canvas.width / viewport.zoom) + gridSize * 2;
      const endY = startY + (canvas.height / viewport.zoom) + gridSize * 2;
      ctx.strokeStyle = 'hsl(210, 40%, 96%)';
      ctx.lineWidth = 0.5;
      for (let x = startX; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw strokes
      for (const stroke of strokes) {
        drawStroke(ctx, stroke, viewport);
      }
      if (currentStroke) {
        drawStroke(ctx, currentStroke, viewport);
      }

      // Draw cursors
      for (const cursor of cursors) {
        ctx.save();
        ctx.translate(viewport.x + cursor.x * viewport.zoom, viewport.y + cursor.y * viewport.zoom);

        // Cursor triangle
        ctx.fillStyle = cursor.color;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 16);
        ctx.lineTo(11, 11);
        ctx.closePath();
        ctx.fill();

        // Name label
        ctx.font = '11px sans-serif';
        const textW = ctx.measureText(cursor.name).width;
        ctx.fillStyle = cursor.color;
        ctx.beginPath();
        ctx.roundRect(14, 10, textW + 8, 18, 4);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillText(cursor.name, 18, 23);

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [strokes, currentStroke, viewport, cursors]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Middle button or space+click for pan
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }

    if (activeTool === 'text') {
      e.preventDefault();
      e.stopPropagation();
      const pt = toCanvasCoords(e.clientX, e.clientY);
      onTextPlace(pt);
      return;
    }

    const pt = toCanvasCoords(e.clientX, e.clientY);
    const isShape = ['line', 'arrow', 'rectangle', 'circle'].includes(activeTool);

    const stroke: Stroke = {
      id: generateId(),
      tool: activeTool,
      points: isShape ? [] : [pt],
      color: activeTool === 'eraser' ? '#ffffff' : activeColor,
      size: brushSize,
      playerId,
      startPoint: isShape ? pt : undefined,
      endPoint: isShape ? pt : undefined,
    };

    setCurrentStroke(stroke);
    setIsDrawing(true);
  }, [activeTool, activeColor, brushSize, playerId, toCanvasCoords, viewport, onTextPlace]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const pt = toCanvasCoords(e.clientX, e.clientY);
    onCursorMove(pt.x, pt.y);

    if (isPanning) {
      setViewport(v => {
        const newV = {
          ...v,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        };
        onViewportChange?.(newV);
        return newV;
      });
      return;
    }

    if (!isDrawing || !currentStroke) return;

    const isShape = ['line', 'arrow', 'rectangle', 'circle'].includes(currentStroke.tool);
    if (isShape) {
      setCurrentStroke(s => s ? { ...s, endPoint: pt } : null);
    } else {
      setCurrentStroke(s => s ? { ...s, points: [...s.points, pt] } : null);
    }
  }, [isDrawing, currentStroke, isPanning, panStart, toCanvasCoords, onCursorMove]);

  const handlePointerUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    if (isDrawing && currentStroke) {
      onStrokeComplete(currentStroke);
      setCurrentStroke(null);
      setIsDrawing(false);
    }
  }, [isDrawing, currentStroke, isPanning, onStrokeComplete]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.95 : 1.05;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setViewport(v => {
      const newZoom = Math.min(Math.max(v.zoom * scaleFactor, 0.1), 5);
      const newViewport = {
        x: mx - (mx - v.x) * (newZoom / v.zoom),
        y: my - (my - v.y) * (newZoom / v.zoom),
        zoom: newZoom,
      };
      onViewportChange?.(newViewport);
      return newViewport;
    });
  }, [onViewportChange]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    />
  );
};`
  },
  {
    name: "src/components/canvas/Toolbar.tsx",
    language: "typescript",
    code: `import React, { useState } from 'react';
import {
  Pen, Eraser, Square, Circle, Minus, ArrowRight,
  Type, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Tool } from '@/types/canvas';
import { PALETTE_COLORS } from '@/types/canvas';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  isHost: boolean;
}

const TOOLS: { tool: Tool; icon: React.ReactNode; label: string }[] = [
  { tool: 'pen', icon: <Pen className="h-4 w-4" />, label: 'Pen' },
  { tool: 'eraser', icon: <Eraser className="h-4 w-4" />, label: 'Eraser' },
  { tool: 'line', icon: <Minus className="h-4 w-4" />, label: 'Line' },
  { tool: 'arrow', icon: <ArrowRight className="h-4 w-4" />, label: 'Arrow' },
  { tool: 'rectangle', icon: <Square className="h-4 w-4" />, label: 'Rectangle' },
  { tool: 'circle', icon: <Circle className="h-4 w-4" />, label: 'Circle' },
  { tool: 'text', icon: <Type className="h-4 w-4" />, label: 'Text' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool, onToolChange, activeColor, onColorChange,
  brushSize, onBrushSizeChange, onClear, isHost,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="absolute bottom-4 left-2 right-2 z-50 flex flex-col gap-2">
        {/* Main toolbar row */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card/95 backdrop-blur-md px-2 py-1.5 shadow-lg">
          {/* Tools - scrollable */}
          <div className="flex items-center gap-0.5 overflow-x-auto flex-1 mr-1">
            {TOOLS.map(({ tool, icon }) => (
              <Button
                key={tool}
                variant={activeTool === tool ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => onToolChange(tool)}
              >
                {icon}
              </Button>
            ))}
          </div>

          {/* Color picker popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="h-7 w-7 rounded-full border-2 border-border shrink-0"
                style={{ backgroundColor: activeColor }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" side="top">
              <div className="grid grid-cols-6 gap-1.5">
                {PALETTE_COLORS.map((color) => (
                  <button
                    key={color}
                    className={\`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 \${activeColor === color ? 'border-ring scale-110' : 'border-transparent'}\`}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(color)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2 px-1">
                <Slider
                  value={[brushSize]}
                  onValueChange={([v]) => onBrushSizeChange(v)}
                  min={1}
                  max={30}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground w-6 text-right">{brushSize}</span>
              </div>
            </PopoverContent>
          </Popover>

          {isHost && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive ml-1" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-xl border border-border bg-card/95 backdrop-blur-md px-3 py-2 shadow-lg">
      {/* Tools */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
        {TOOLS.map(({ tool, icon, label }) => (
          <Tooltip key={tool}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => onToolChange(tool)}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Colors */}
      <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            className={\`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 \${activeColor === color ? 'border-ring scale-110' : 'border-transparent'}\`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
          />
        ))}
      </div>

      {/* Brush size */}
      <div className="flex items-center gap-2 border-r border-border pr-2 mr-1 w-24">
        <Slider
          value={[brushSize]}
          onValueChange={([v]) => onBrushSizeChange(v)}
          min={1}
          max={30}
          step={1}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground w-6 text-right">{brushSize}</span>
      </div>

      {isHost && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onClear}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear Canvas (Host)</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};`
  },
  {
    name: "src/components/canvas/TextInput.tsx",
    language: "typescript",
    code: `import React, { useState, useRef, useEffect } from 'react';
import type { Point } from '@/types/canvas';

interface TextInputProps {
  position: Point;
  color: string;
  fontSize: number;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  viewport: { x: number; y: number; zoom: number };
}

export const TextInput: React.FC<TextInputProps> = ({
  position, color, fontSize, onSubmit, onCancel, viewport,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const screenX = position.x * viewport.zoom + viewport.x;
  const screenY = position.y * viewport.zoom + viewport.y;

  const mountedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => { mountedRef.current = true; }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed z-[60]"
      style={{ left: screenX, top: screenY, pointerEvents: 'none' }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        className="bg-transparent"
        style={{
          color,
          caretColor: color,
          WebkitTextFillColor: color,
          fontSize,
          lineHeight: \`\${fontSize}px\`,
          minWidth: 100,
          border: 'none',
          background: 'transparent',
          padding: 0,
          margin: 0,
          outline: 'none',
          appearance: 'none',
          pointerEvents: 'auto',
          transform: 'translateY(1px)',
          fontFamily: 'sans-serif',
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && text.trim()) {
            onSubmit(text);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        onBlur={() => {
          if (!mountedRef.current) return;
          if (text.trim()) onSubmit(text);
          else onCancel();
        }}
      />
    </div>
  );
};`
  },
  {
    name: "src/components/canvas/PlayerList.tsx",
    language: "typescript",
    code: `import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'lucide-react';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  isHost: boolean;
}

interface PlayerListProps {
  players: Player[];
  myId?: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, myId }) => {
  const isMobile = useIsMobile();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast('Invite link copied!');
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 sm:gap-3 rounded-full border border-border bg-card/95 backdrop-blur-md px-2 sm:px-3 py-1.5 shadow-lg">
      <div className="flex items-center">
        {players.map((player, i) => (
          <Avatar
            key={player.id}
            className={\`h-7 w-7 ring-2 ring-card \${i > 0 ? '-ml-2' : ''}\`}
            title={\`\${player.name}\${player.id === myId ? ' (you)' : ''}\${player.isHost ? ' ★' : ''}\`}
          >
            {player.avatar && <AvatarImage src={player.avatar} alt={player.name} />}
            <AvatarFallback
              className="text-[10px] font-bold"
              style={{ backgroundColor: player.color, color: '#fff' }}
            >
              {player.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {!isMobile && (
        <span className="text-xs text-muted-foreground font-medium">
          {players.length} {players.length === 1 ? 'user' : 'users'}
        </span>
      )}
      <button
        onClick={handleShare}
        className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <Link size={12} />
        {!isMobile && 'Invite'}
      </button>
    </div>
  );
};`
  }
]
