import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from 'react';
import { Loader2, Move } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';
import { cn } from '../lib/utils';

interface CanvasProps {
  backgroundImage: string | null;
  foregroundImage: string | null;
  textSets: TextSet[];
  isLoading: boolean;
  canvasWidth: number;
  canvasHeight: number;
  previewDisplayWidth?: number;
  previewDisplayHeight?: number;
  onTextPositionChange?: (textId: string, position: { x: number; y: number }) => void;
}

export interface CanvasHandle {
  renderToCanvas: (ctx: CanvasRenderingContext2D) => Promise<void>;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(({
  backgroundImage,
  foregroundImage,
  textSets,
  isLoading,
  canvasWidth,
  canvasHeight,
  previewDisplayWidth = 480,
  previewDisplayHeight = 480,
  onTextPositionChange
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedTextId, setDraggedTextId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate scale factors for preview
  const scaleX = previewDisplayWidth / canvasWidth;
  const scaleY = previewDisplayHeight / canvasHeight;

  // Unified render function
  const renderToCanvas = async (ctx: CanvasRenderingContext2D) => {
    // Fill background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image
    if (backgroundImage) {
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          resolve();
        };
        img.src = backgroundImage;
      });
    }

    // Draw text
    textSets.forEach((textSet) => {
      ctx.save();
      
      // Build font string with proper style, weight, size, and family
      const fontStyle = textSet.fontStyle === 'italic' ? 'italic' : 'normal';
      const fontString = `${fontStyle} ${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}", sans-serif`;
      
      // Set font and ensure it's loaded
      ctx.font = fontString;
      ctx.fillStyle = textSet.textColor;
      ctx.globalAlpha = textSet.opacity;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      
      // Apply transformations
      ctx.translate(textSet.position.x, textSet.position.y);
      ctx.rotate((textSet.rotation * Math.PI) / 180);
      
      // Apply text shadow if enabled
      if (textSet.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      
      // Draw text lines
      const lines = textSet.text.split('\n');
      lines.forEach((line, index) => {
        ctx.fillText(line, 0, index * textSet.fontSize * 1.25);
      });
      
      ctx.restore();
    });

    // Draw foreground image
    if (foregroundImage) {
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          resolve();
        };
        img.src = foregroundImage;
      });
    }
  };

  // Expose renderToCanvas to parent
  useImperativeHandle(ref, () => ({ renderToCanvas }), [backgroundImage, foregroundImage, textSets, canvasWidth, canvasHeight]);

  // Render preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Ensure fonts are loaded before rendering
    document.fonts.ready.then(() => {
      renderToCanvas(ctx);
    }).catch(() => {
      // Fallback if fonts aren't ready
      renderToCanvas(ctx);
    });
  }, [backgroundImage, foregroundImage, textSets, canvasWidth, canvasHeight]);

  // Mouse event handlers for text dragging
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onTextPositionChange) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    // Check if click is on any text
    const clickedText = textSets.find(textSet => {
      const textWidth = textSet.fontSize * textSet.text.length * 0.6; // Approximate text width
      const textHeight = textSet.fontSize * 1.25;
      
      return x >= textSet.position.x && 
             x <= textSet.position.x + textWidth &&
             y >= textSet.position.y && 
             y <= textSet.position.y + textHeight;
    });

    if (clickedText) {
      setIsDragging(true);
      setDraggedTextId(clickedText.id);
      setDragStart({ x: x - clickedText.position.x, y: y - clickedText.position.y });
    }
  }, [textSets, scaleX, scaleY, onTextPositionChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedTextId || !onTextPositionChange) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    const newX = Math.max(0, Math.min(canvasWidth, x - dragStart.x));
    const newY = Math.max(0, Math.min(canvasHeight, y - dragStart.y));

    onTextPositionChange(draggedTextId, { x: newX, y: newY });
  }, [isDragging, draggedTextId, dragStart, scaleX, scaleY, canvasWidth, canvasHeight, onTextPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedTextId(null);
  }, []);

  return (
    <div className={cn("relative canvas-hover", isDragging && "text-movement")} style={{ width: previewDisplayWidth, height: previewDisplayHeight }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ 
          display: 'block', 
          width: previewDisplayWidth, 
          height: previewDisplayHeight, 
          background: '#fff', 
          borderRadius: 12, 
          border: '1px solid #d1d5db',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Drag indicator */}
      {isDragging && (
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 drag-indicator shadow-lg">
          <Move className="w-3 h-3" />
          Dragging text
        </div>
      )}
      
      {/* Instructions */}
      {!isDragging && textSets.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-gray-800/80 text-white px-2 py-1 rounded text-xs">
          Click and drag text to move
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 4 }}>
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
            <p className="text-white text-sm">Processing image...</p>
          </div>
        </div>
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';