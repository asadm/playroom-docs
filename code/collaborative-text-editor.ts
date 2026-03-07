import { CodePlaygroundFile } from "../components/CodePlayground";

export const collaborativeTextEditorExampleFiles: CodePlaygroundFile[] = [
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
}

.doc-paper {
  background: white;
  min-height: 1056px;
  padding: 72px 96px;
  font-size: 24px;
  line-height: 1.6;
  color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 2px;
  outline: none;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.doc-paper:focus {
  outline: none;
}

.doc-paper a {
  color: #4285F4;
  text-decoration: underline;
  cursor: pointer;
}

.doc-paper a:hover {
  opacity: 0.8;
}

.doc-paper img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 8px 0;
}

@keyframes cursor-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-cursor-pulse {
  animation: cursor-pulse 1.2s ease-in-out infinite;
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
    code: `import React, { useEffect, useState } from "react";
import { insertCoin } from "playroomkit";
import EditorHeader from "@/components/EditorHeader";
import DocumentEditor from "@/components/DocumentEditor";

const Index: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    insertCoin({ skipLobby: true }).then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorHeader />
      <DocumentEditor />
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

const MOBILE_BREAKPOINT = 768;

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
    name: "src/components/EditorToolbar.tsx",
    language: "typescript",
    code: `import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Bold, Italic, Underline, Strikethrough, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon,
} from "lucide-react";

const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "Red", value: "#EA4335" },
  { name: "Blue", value: "#4285F4" },
  { name: "Green", value: "#34A853" },
  { name: "Orange", value: "#FF6D01" },
];

interface EditorToolbarProps {
  onCommand: (cmd: string, value?: string) => void;
  onFontColor: (color: string) => void;
  onInsertImage: (file: File) => void;
  currentColor: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onCommand, onFontColor, onInsertImage, currentColor,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onInsertImage(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const ToolBtn = ({ icon: Icon, cmd, title }: { icon: React.ElementType; cmd: string; title: string }) => (
    <Button variant="ghost" size="icon" className="h-8 w-8" title={title} onMouseDown={(e) => { e.preventDefault(); onCommand(cmd); }}>
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="flex items-center justify-center px-4 py-2">
      <div className="flex items-center gap-0.5 bg-card border border-border rounded-full px-3 py-1 shadow-sm">
        <ToolBtn icon={Bold} cmd="bold" title="Bold" />
        <ToolBtn icon={Italic} cmd="italic" title="Italic" />
        <ToolBtn icon={Underline} cmd="underline" title="Underline" />
        <ToolBtn icon={Strikethrough} cmd="strikeThrough" title="Strikethrough" />

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Font Color">
              <Palette className="h-4 w-4" style={{ color: currentColor }} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  className="w-7 h-7 rounded-full border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                  onMouseDown={(e) => { e.preventDefault(); onFontColor(c.value); }}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolBtn icon={AlignLeft} cmd="justifyLeft" title="Align Left" />
        <ToolBtn icon={AlignCenter} cmd="justifyCenter" title="Align Center" />
        <ToolBtn icon={AlignRight} cmd="justifyRight" title="Align Right" />
        <ToolBtn icon={AlignJustify} cmd="justifyFull" title="Justify" />

        <Separator orientation="vertical" className="h-5 mx-1" />

        <Button variant="ghost" size="icon" className="h-8 w-8" title="Insert Image" onClick={() => fileRef.current?.click()}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>
    </div>
  );
};

export default EditorToolbar;`
  },
  {
    name: "src/components/EditorHeader.tsx",
    language: "typescript",
    code: `import React from "react";
import { usePlayersList, myPlayer, getRoomCode } from "playroomkit";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const PLAYER_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853", "#FF6D01", "#46BDC6", "#7B1FA2", "#C2185B"];

const EditorHeader: React.FC = () => {
  const players = usePlayersList(true);
  const [copied, setCopied] = React.useState(false);
  const roomCode = getRoomCode();

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Room:</span>
        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{roomCode || "..."}</code>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyRoomCode}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="flex items-center gap-1">
        {players.map((player, i) => {
          const color = PLAYER_COLORS[i % PLAYER_COLORS.length];
          const name = player.getProfile()?.name || \`P\${i + 1}\`;
          const isMe = player.id === myPlayer()?.id;
          return (
            <Avatar key={player.id} className={\`h-8 w-8 border-2 \${isMe ? "ring-2 ring-ring" : ""}\`} style={{ borderColor: color }}>
              <AvatarFallback className="text-xs font-bold" style={{ backgroundColor: color, color: "#fff" }}>
                {name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>
    </header>
  );
};

export default EditorHeader;`
  },
  {
    name: "src/components/DocumentEditor.tsx",
    language: "typescript",
    code: `import React, { useRef, useCallback, useEffect, useState } from "react";
import { useMultiplayerState } from "playroomkit";
import EditorToolbar from "./EditorToolbar";

const DocumentEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [docContent, setDocContent] = useMultiplayerState("doc", "");

  const [currentColor, setCurrentColor] = useState("#000000");
  const isRemoteUpdate = useRef(false);
  const pendingLocalChanges = useRef(0);
  const syncTimer = useRef<ReturnType<typeof setTimeout>>();

  // Sync incoming content (remote only)
  useEffect(() => {
    if (!editorRef.current || !docContent) return;
    if (pendingLocalChanges.current > 0) {
      pendingLocalChanges.current--;
      return;
    }
    if (isRemoteUpdate.current) return;

    const currentHtml = editorRef.current.innerHTML;
    if (currentHtml !== docContent) {
      isRemoteUpdate.current = true;
      editorRef.current.innerHTML = docContent as string;
      isRemoteUpdate.current = false;
    }
  }, [docContent]);

  const throttledSync = useCallback(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      if (editorRef.current) {
        pendingLocalChanges.current++;
        setDocContent(editorRef.current.innerHTML);
      }
    }, 300);
  }, [setDocContent]);

  const handleInput = useCallback(() => {
    throttledSync();
  }, [throttledSync]);

  const execCommand = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    throttledSync();
  }, [throttledSync]);

  const handleFontColor = useCallback((color: string) => {
    setCurrentColor(color);
    document.execCommand("foreColor", false, color);
    if (editorRef.current) {
      editorRef.current.style.caretColor = color;
    }
    throttledSync();
  }, [throttledSync]);

  const handleInsertImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      const img = \`<img src="\${reader.result}" style="max-width:100%;height:auto;" />\`;
      document.execCommand("insertHTML", false, img);
      throttledSync();
    };
    reader.readAsDataURL(file);
  }, [throttledSync]);

  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open((target as HTMLAnchorElement).href, "_blank");
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <EditorToolbar
        onCommand={execCommand}
        onFontColor={handleFontColor}
        onInsertImage={handleInsertImage}
        currentColor={currentColor}
      />
      <div className="flex-1 overflow-auto bg-muted flex justify-center py-8 px-4">
        <div className="relative w-full max-w-[816px]">
          <div
            ref={editorRef}
            className="doc-paper"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onClick={handleEditorClick}
            style={{ caretColor: currentColor, fontSize: "24px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;`
  }
]