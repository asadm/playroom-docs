import React, { useState } from 'react';
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
                    className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      activeColor === color ? 'border-ring scale-110' : 'border-transparent'
                    }`}
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
            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
              activeColor === color ? 'border-ring scale-110' : 'border-transparent'
            }`}
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
};
