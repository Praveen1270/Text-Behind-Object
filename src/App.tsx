import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { ImageUpload } from './components/ImageUpload';
import { TextEditor } from './components/TextEditor';
import { Canvas, CanvasHandle } from './components/Canvas';
import { useImageProcessor } from './hooks/useImageProcessor';
import { useTextState } from './hooks/useTextState';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    backgroundImage,
    foregroundImage,
    processImage,
    isLoading: isProcessingImage
  } = useImageProcessor();

  const {
    textSets,
    addTextSet,
    updateTextSet,
    removeTextSet,
    duplicateTextSet
  } = useTextState();

  const canvasRef = useRef<CanvasHandle>(null);

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = imageUrl;
    await processImage(file);
  }, [processImage]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);
    try {
      // Wait for fonts to be ready
      await document.fonts.ready;
      // Create an offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = CANVAS_WIDTH;
      offscreen.height = CANVAS_HEIGHT;
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      await canvasRef.current.renderToCanvas(ctx);
      // Download the image
      const link = document.createElement('a');
      link.download = 'text-behind-object.png';
      link.href = offscreen.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setImageDimensions(null);
  };

  return (
    <div className={`min-h-screen transition-colors bg-white`}>
      {/* Header */}
      <div className={`border-b border-gray-200 bg-white`}>
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className={`text-xl font-semibold text-gray-900`}>
            Text behind object editor
          </h1>
          <div className="flex items-center space-x-4">
            {originalImage && (
              <button
                onClick={handleDownload}
                disabled={isProcessing || isProcessingImage}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Saving...' : 'Save Image'}
              </button>
            )}
          </div>
        </div>
      </div>
      {!originalImage ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className={`text-2xl font-medium mb-8 text-gray-900`}>
              Welcome, get started by uploading an image!
            </h2>
            <ImageUpload onImageUpload={handleImageUpload} isDarkMode={false} />
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-80px)]">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <Canvas
              ref={canvasRef}
              backgroundImage={backgroundImage}
              foregroundImage={foregroundImage}
              textSets={textSets}
              isLoading={isProcessingImage}
              canvasWidth={CANVAS_WIDTH}
              canvasHeight={CANVAS_HEIGHT}
              previewDisplaySize={360}
            />
          </div>
          {/* Right Panel */}
          <div className={`w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={addTextSet}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors`}
                >
                  <span className="text-lg">+</span>
                  <span>Add New Text Set</span>
                </button>
              </div>
              <div className="space-y-6">
                {textSets.map((textSet) => (
                  <TextEditor
                    key={textSet.id}
                    textSet={textSet}
                    onUpdate={updateTextSet}
                    onRemove={removeTextSet}
                    onDuplicate={duplicateTextSet}
                    imageDimensions={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;