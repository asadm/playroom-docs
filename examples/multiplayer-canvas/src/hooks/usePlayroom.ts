import { useState, useEffect, useCallback, useRef } from 'react';
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
        name: String(profile.name || `Player ${playerList.length + 1}`),
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
}
