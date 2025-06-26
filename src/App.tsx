import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Sun, Moon } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import html2canvas from 'html2canvas';
import { ImageUpload } from './components/ImageUpload';
import { TextEditor } from './components/TextEditor';
import { Canvas } from './components/Canvas';
import { useImageProcessor } from './hooks/useImageProcessor';
import { useTextState } from './hooks/useTextState';

function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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

  const canvasRef = useRef<HTMLDivElement>(null);

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
    if (!imageDimensions || !backgroundImage) return;
    
    setIsProcessing(true);
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = imageDimensions.width;
      canvas.height = imageDimensions.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // Load and draw background image
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = backgroundImage;
      });
      
      ctx.drawImage(bgImg, 0, 0, imageDimensions.width, imageDimensions.height);

      // Draw text layers
      textSets.forEach((textSet) => {
        ctx.save();
        
        // Set text properties
        ctx.font = `${textSet.fontWeight} ${textSet.fontSize}px ${textSet.fontFamily}`;
        ctx.fillStyle = textSet.textColor;
        ctx.globalAlpha = textSet.opacity;
        ctx.textBaseline = 'top';
        
        // Apply transformations
        ctx.translate(textSet.position.x, textSet.position.y);
        ctx.rotate((textSet.rotation * Math.PI) / 180);
        
        // Add text shadow if enabled
        if (textSet.textShadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }
        
        // Draw text
        const lines = textSet.text.split('\n');
        lines.forEach((line, index) => {
          ctx.fillText(line, 0, index * textSet.fontSize * 1.2);
        });
        
        ctx.restore();
      });

      // Draw foreground image if available
      if (foregroundImage) {
        const fgImg = new Image();
        fgImg.crossOrigin = 'anonymous';
        
        await new Promise((resolve, reject) => {
          fgImg.onload = resolve;
          fgImg.onerror = reject;
          fgImg.src = foregroundImage;
        });
        
        ctx.drawImage(fgImg, 0, 0, imageDimensions.width, imageDimensions.height);
      }

      // Download the image
      const link = document.createElement('a');
      link.download = 'text-behind-object.png';
      link.href = canvas.toDataURL('image/png');
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
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Text behind image editor
          </h1>
          
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              1 generations left
            </span>
            <button className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Upgrade
            </button>
            
            {originalImage && (
              <button
                onClick={handleDownload}
                disabled={isProcessing || isProcessingImage}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? 'Saving...' : 'Save Image'}
              </button>
            )}
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className={`px-3 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              TBI
            </div>
          </div>
        </div>
      </div>

      {!originalImage ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <h2 className={`text-2xl font-medium mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome, get started by uploading an image!
            </h2>
            <ImageUpload onImageUpload={handleImageUpload} isDarkMode={isDarkMode} />
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
              onTextSetUpdate={updateTextSet}
              isLoading={isProcessingImage}
              imageDimensions={imageDimensions}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Right Panel */}
          <div className={`w-80 border-l ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={addTextSet}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
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
                    isDarkMode={isDarkMode}
                    imageDimensions={imageDimensions}
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