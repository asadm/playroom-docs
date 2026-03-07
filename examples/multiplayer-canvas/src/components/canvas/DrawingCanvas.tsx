import React, { useRef, useEffect, useState, useCallback } from 'react';
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
    ctx.font = `${stroke.fontSize || 16}px sans-serif`;
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
};
