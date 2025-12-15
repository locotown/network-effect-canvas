import { useState, useCallback, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  storageKey?: string;
  defaultPosition: Position;
  enabled?: boolean;
}

export const useDraggable = ({
  storageKey,
  defaultPosition,
  enabled = true,
}: UseDraggableOptions) => {
  // Load position from localStorage
  const loadPosition = (): Position => {
    if (!storageKey) return defaultPosition;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return defaultPosition;
  };

  // Save position to localStorage
  const savePosition = (position: Position) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(position));
    } catch {
      // ignore
    }
  };

  const [position, setPosition] = useState<Position>(loadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    const newX = dragStartRef.current.posX + deltaX;
    const newY = dragStartRef.current.posY + deltaY;

    // Get panel dimensions
    const panelWidth = panelRef.current?.offsetWidth || 288;
    const panelHeight = panelRef.current?.offsetHeight || 200;

    // Constrain to viewport (accounting for header height ~100px)
    const maxX = window.innerWidth - panelWidth - 10;
    const maxY = window.innerHeight - panelHeight - 10;

    setPosition({
      x: Math.max(10, Math.min(newX, maxX)),
      y: Math.max(10, Math.min(newY, maxY)),
    });
  }, [isDragging]);

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
      dragStartRef.current = null;
    }
  }, [isDragging, position]);

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Start dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enabled) return;

    // Store starting position
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
    e.preventDefault();
  }, [enabled, position]);

  // Reset position to default
  const resetPosition = useCallback(() => {
    setPosition(defaultPosition);
    savePosition(defaultPosition);
  }, [defaultPosition]);

  return {
    position,
    setPosition,
    isDragging,
    panelRef,
    handleMouseDown,
    resetPosition,
  };
};
