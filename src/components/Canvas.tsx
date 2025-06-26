import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';

interface CanvasProps {
  backgroundImage: string | null;
  foregroundImage: string | null;
  textSets: TextSet[];
  isLoading: boolean;
  canvasWidth: number;
  canvasHeight: number;
  previewDisplayWidth?: number;
  previewDisplayHeight?: number;
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
  previewDisplayWidth = 360,
  previewDisplayHeight = 360
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
      ctx.fillStyle = textSet.textColor;
      ctx.globalAlpha = textSet.opacity;
      ctx.textBaseline = 'top';
      ctx.translate(textSet.position.x, textSet.position.y);
      ctx.rotate((textSet.rotation * Math.PI) / 180);
      if (textSet.textShadow) {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
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
    renderToCanvas(ctx);
  }, [backgroundImage, foregroundImage, textSets, canvasWidth, canvasHeight]);

  return (
    <div className="relative" style={{ width: previewDisplayWidth, height: previewDisplayHeight }}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{ display: 'block', width: previewDisplayWidth, height: previewDisplayHeight, background: '#fff', borderRadius: 12, border: '1px solid #d1d5db' }}
      />
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