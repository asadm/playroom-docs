import React, { useState, useCallback } from 'react';
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

export default CanvasPage;
