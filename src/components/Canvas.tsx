import React, { forwardRef, useCallback, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';

interface CanvasProps {
  backgroundImage: string | null;
  foregroundImage: string | null;
  textSets: TextSet[];
  onTextSetUpdate: (id: string, updates: Partial<TextSet>) => void;
  isLoading: boolean;
  imageDimensions: { width: number; height: number } | null;
  isDarkMode: boolean;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(({
  backgroundImage,
  foregroundImage,
  textSets,
  onTextSetUpdate,
  isLoading,
  imageDimensions,
  isDarkMode
}, ref) => {
  const dragState = useRef<{ textId: string | null; offset: { x: number; y: number } }>({
    textId: null,
    offset: { x: 0, y: 0 }
  });

  const handleMouseDown = useCallback((e: React.MouseEvent, textId: string) => {
    e.preventDefault();
    const textSet = textSets.find(t => t.id === textId);
    if (!textSet) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const canvasRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
    if (!canvasRect || !imageDimensions) return;

    // Calculate scale factor between display and actual image
    const scaleX = imageDimensions.width / canvasRect.width;
    const scaleY = imageDimensions.height / canvasRect.height;

    dragState.current = {
      textId,
      offset: {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      }
    };
  }, [textSets, ref, imageDimensions]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current.textId || !imageDimensions) return;
    
    const canvasRect = (ref as React.RefObject<HTMLDivElement>)?.current?.getBoundingClientRect();
    if (!canvasRect) return;

    // Calculate scale factor between display and actual image
    const scaleX = imageDimensions.width / canvasRect.width;
    const scaleY = imageDimensions.height / canvasRect.height;

    // Convert mouse position to actual image coordinates
    const actualX = (e.clientX - canvasRect.left) * scaleX - dragState.current.offset.x;
    const actualY = (e.clientY - canvasRect.top) * scaleY - dragState.current.offset.y;
    
    onTextSetUpdate(dragState.current.textId, {
      position: { 
        x: Math.max(0, Math.min(actualX, imageDimensions.width)), 
        y: Math.max(0, Math.min(actualY, imageDimensions.height))
      }
    });
  }, [onTextSetUpdate, ref, imageDimensions]);

  const handleMouseUp = useCallback(() => {
    dragState.current.textId = null;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!imageDimensions) return null;

  // Calculate display dimensions while maintaining aspect ratio
  const aspectRatio = imageDimensions.width / imageDimensions.height;
  const maxWidth = 800;
  const maxHeight = 600;
  
  let displayWidth = maxWidth;
  let displayHeight = maxWidth / aspectRatio;
  
  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = maxHeight * aspectRatio;
  }

  // Scale factor for converting between display and actual coordinates
  const scaleX = displayWidth / imageDimensions.width;
  const scaleY = displayHeight / imageDimensions.height;

  return (
    <div className="relative">
      <div
        ref={ref}
        className={`relative border rounded-lg overflow-hidden ${
          isDarkMode ? 'border-gray-600' : 'border-gray-300'
        }`}
        style={{ 
          width: displayWidth, 
          height: displayHeight,
          backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb'
        }}
      >
        {/* Background Layer */}
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Background"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ zIndex: 1 }}
            crossOrigin="anonymous"
          />
        )}

        {/* Text Layers */}
        {textSets.map((textSet) => (
          <div
            key={textSet.id}
            className="absolute font-bold leading-tight select-none cursor-move"
            style={{
              fontSize: `${textSet.fontSize * scaleX}px`,
              fontFamily: textSet.fontFamily,
              color: textSet.textColor,
              fontWeight: textSet.fontWeight,
              opacity: textSet.opacity,
              transform: `translate(${textSet.position.x * scaleX}px, ${textSet.position.y * scaleY}px) rotate(${textSet.rotation}deg) skew(${textSet.horizontalTilt}deg, ${textSet.verticalTilt}deg)`,
              transformOrigin: 'center',
              whiteSpace: 'pre-wrap',
              zIndex: 2,
              textShadow: textSet.textShadow ? '2px 2px 4px rgba(0,0,0,0.5)' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, textSet.id)}
          >
            {textSet.text}
          </div>
        ))}

        {/* Foreground Layer */}
        {foregroundImage && (
          <img
            src={foregroundImage}
            alt="Foreground"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ zIndex: 3 }}
            crossOrigin="anonymous"
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center" style={{ zIndex: 4 }}>
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <p className="text-white text-sm">Processing image...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';