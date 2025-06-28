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
  
  // Image loading state management
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [foregroundImageLoaded, setForegroundImageLoaded] = useState(false);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const foregroundImageRef = useRef<HTMLImageElement | null>(null);
  
  // Animation frame management
  let animationFrameId: number | null = null;
  let lastRenderTime = 0;
  const RENDER_THROTTLE = 16; // ~60fps

  // Calculate scale factors for preview
  const scaleX = previewDisplayWidth / canvasWidth;
  const scaleY = previewDisplayHeight / canvasHeight;

  // Helper function to measure text dimensions
  const measureText = useCallback((textSet: TextSet, ctx: CanvasRenderingContext2D) => {
    const fontStyle = textSet.fontStyle === 'italic' ? 'italic' : 'normal';
    const fontString = `${fontStyle} ${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}", sans-serif`;
    ctx.font = fontString;
    
    const lines = textSet.text.split('\n');
    let maxWidth = 0;
    let totalHeight = 0;
    
    lines.forEach((line) => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
      totalHeight += textSet.fontSize * 1.25;
    });
    
    return { width: maxWidth, height: totalHeight };
  }, []);

  // Load and cache background image
  useEffect(() => {
    if (!backgroundImage) {
      setBackgroundImageLoaded(false);
      backgroundImageRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      backgroundImageRef.current = img;
      setBackgroundImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load background image');
      setBackgroundImageLoaded(false);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Load and cache foreground image
  useEffect(() => {
    if (!foregroundImage) {
      setForegroundImageLoaded(false);
      foregroundImageRef.current = null;
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      foregroundImageRef.current = img;
      setForegroundImageLoaded(true);
    };
    img.onerror = () => {
      console.error('Failed to load foreground image');
      setForegroundImageLoaded(false);
    };
    img.src = foregroundImage;
  }, [foregroundImage]);

  // Main render function - optimized for performance
  const renderCanvas = useCallback((ctx: CanvasRenderingContext2D, isExport = false) => {
    const now = performance.now();
    
    // Throttle renders for smooth performance
    if (!isExport && now - lastRenderTime < RENDER_THROTTLE) {
      return;
    }
    lastRenderTime = now;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw background image if loaded
    if (backgroundImageLoaded && backgroundImageRef.current) {
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvasWidth, canvasHeight);
    }

    // Draw text layers
    textSets.forEach((textSet) => {
      ctx.save();
      
      // Build font string
      const fontStyle = textSet.fontStyle === 'italic' ? 'italic' : 'normal';
      const fontString = `${fontStyle} ${textSet.fontWeight} ${textSet.fontSize}px "${textSet.fontFamily}", sans-serif`;
      
      // Set text properties
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

    // Draw foreground image if loaded
    if (foregroundImageLoaded && foregroundImageRef.current) {
      ctx.drawImage(foregroundImageRef.current, 0, 0, canvasWidth, canvasHeight);
    }
  }, [backgroundImageLoaded, foregroundImageLoaded, textSets, canvasWidth, canvasHeight]);

  // Throttled update function using requestAnimationFrame
  const updateCanvas = useCallback(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      renderCanvas(ctx);
    });
  }, [renderCanvas]);

  // Export function for download - ensures all images are loaded
  const renderToCanvas = useCallback(async (ctx: CanvasRenderingContext2D) => {
    // Wait for all images to be loaded
    if (backgroundImage && !backgroundImageLoaded) {
      await new Promise<void>((resolve) => {
        const checkLoaded = () => {
          if (backgroundImageLoaded) {
            resolve();
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    if (foregroundImage && !foregroundImageLoaded) {
      await new Promise<void>((resolve) => {
        const checkLoaded = () => {
          if (foregroundImageLoaded) {
            resolve();
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    // Wait for fonts to be ready
    await document.fonts.ready;
    
    // Render with export flag (no throttling)
    renderCanvas(ctx, true);
  }, [backgroundImage, foregroundImage, backgroundImageLoaded, foregroundImageLoaded, renderCanvas]);

  // Expose renderToCanvas to parent
  useImperativeHandle(ref, () => ({ renderToCanvas }), [renderToCanvas]);

  // Update canvas when dependencies change
  useEffect(() => {
    updateCanvas();
  }, [textSets, backgroundImageLoaded, foregroundImageLoaded, updateCanvas]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Mouse event handlers for text dragging
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !onTextPositionChange) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scaleX;
    const y = (e.clientY - rect.top) / scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if click is on any text with proper measurement
    const clickedText = textSets.find(textSet => {
      const { width, height } = measureText(textSet, ctx);
      
      const textBounds = {
        left: textSet.position.x,
        right: textSet.position.x + width,
        top: textSet.position.y,
        bottom: textSet.position.y + height
      };
      
      return x >= textBounds.left && 
             x <= textBounds.right &&
             y >= textBounds.top && 
             y <= textBounds.bottom;
    });

    if (clickedText) {
      setIsDragging(true);
      setDraggedTextId(clickedText.id);
      setDragStart({ x: x - clickedText.position.x, y: y - clickedText.position.y });
    }
  }, [textSets, scaleX, scaleY, onTextPositionChange, measureText]);

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
    
    // Update canvas immediately during drag for smooth feedback
    updateCanvas();
  }, [isDragging, draggedTextId, dragStart, scaleX, scaleY, canvasWidth, canvasHeight, onTextPositionChange, updateCanvas]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedTextId(null);
  }, []);

  return (
    <div className={cn("relative canvas-hover", isDragging && "text-movement")} style={{ width: previewDisplayWidth, height: previewDisplayHeight }}>
      {/* Main display canvas */}
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
      
      {/* Loading indicator */}
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