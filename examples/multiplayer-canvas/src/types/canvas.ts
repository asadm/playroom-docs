export type Tool = 'pen' | 'eraser' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'text';

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
];
