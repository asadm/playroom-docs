import React, { useState, useRef, useEffect } from 'react';
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
          lineHeight: `${fontSize}px`,
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
};
