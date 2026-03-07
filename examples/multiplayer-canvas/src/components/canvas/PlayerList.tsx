import React from 'react';
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
            className={`h-7 w-7 ring-2 ring-card ${i > 0 ? '-ml-2' : ''}`}
            title={`${player.name}${player.id === myId ? ' (you)' : ''}${player.isHost ? ' ★' : ''}`}
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
};
