import React from "react";
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
          const name = player.getProfile()?.name || `P${i + 1}`;
          const isMe = player.id === myPlayer()?.id;
          return (
            <Avatar key={player.id} className={`h-8 w-8 border-2 ${isMe ? "ring-2 ring-ring" : ""}`} style={{ borderColor: color }}>
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

export default EditorHeader;
