import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Download } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { ImageUpload } from './components/ImageUpload';
import { TextEditor } from './components/TextEditor';
import { Canvas, CanvasHandle } from './components/Canvas';
import { useImageProcessor } from './hooks/useImageProcessor';
import { useTextState } from './hooks/useTextState';
import LandingPage from './components/LandingPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Analytics } from '@vercel/analytics/react';
import SignIn from './components/SignIn';
import ProfileMenu from './components/ProfileMenu';
import ProtectedRoute from './components/ProtectedRoute';
import UpgradeButton from './components/UpgradeButton';
import UpgradeModal from './components/UpgradeModal';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

function Editor() {
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
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('has_paid')
        .eq('id', user.id)
        .single();
      if (error) {
        setHasPaid(false);
      } else {
        setHasPaid(!!data?.has_paid);
      }
      setLoading(false);
    };
    fetchPaymentStatus();
  }, []);

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
    if (!canvasRef.current || !imageDimensions) return;
    setIsProcessing(true);
    try {
      await document.fonts.ready;
      // Create an offscreen canvas with the original image's shape
      const offscreen = document.createElement('canvas');
      offscreen.width = imageDimensions.width;
      offscreen.height = imageDimensions.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      await canvasRef.current.renderToCanvas(ctx);
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

  const handleTextPositionChange = useCallback((textId: string, position: { x: number; y: number }) => {
    updateTextSet(textId, { position });
  }, [updateTextSet]);

  // Calculate full image preview dimensions with max constraints
  let previewDisplayWidth = 800;
  let previewDisplayHeight = 600;
  if (imageDimensions) {
    const maxWidth = 800;
    const maxHeight = 600;
    const aspect = imageDimensions.width / imageDimensions.height;
    if (aspect >= 1) {
      previewDisplayWidth = Math.min(maxWidth, imageDimensions.width);
      previewDisplayHeight = previewDisplayWidth / aspect;
      if (previewDisplayHeight > maxHeight) {
        previewDisplayHeight = maxHeight;
        previewDisplayWidth = maxHeight * aspect;
      }
    } else {
      previewDisplayHeight = Math.min(maxHeight, imageDimensions.height);
      previewDisplayWidth = previewDisplayHeight * aspect;
      if (previewDisplayWidth > maxWidth) {
        previewDisplayWidth = maxWidth;
        previewDisplayHeight = maxWidth / aspect;
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking payment status...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="min-h-screen transition-colors bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Text behind object editor
            </h1>
            <div className="flex items-center space-x-4">
              {/* Save button to the left of ProfileMenu */}
              {hasPaid && originalImage && (
                <button
                  onClick={handleDownload}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {isProcessing ? 'Saving...' : 'Save Image'}
                </button>
              )}
              
              <ProfileMenu />
            </div>
          </div>
        </div>
        <div className="relative">
          {/* Main content overlay if not paid */}
          {!hasPaid && (
            <UpgradeModal open={true} onClose={() => {}} hideClose={true} />
          )}
          {/* Main content (blurred if not paid) */}
          <div className={hasPaid ? '' : 'filter blur-sm pointer-events-none select-none'}>
            {!originalImage ? (
              <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="text-center">
                  <h2 className="text-2xl font-medium mb-8 text-gray-900">
                    Welcome, get started by uploading an image!
                  </h2>
                  <ImageUpload onImageUpload={handleImageUpload} isDarkMode={false} />
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-80px)]">
                {/* Canvas Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <Canvas
                    ref={canvasRef}
                    backgroundImage={backgroundImage}
                    foregroundImage={foregroundImage}
                    textSets={textSets}
                    isLoading={isProcessingImage}
                    canvasWidth={imageDimensions ? imageDimensions.width : CANVAS_WIDTH}
                    canvasHeight={imageDimensions ? imageDimensions.height : CANVAS_HEIGHT}
                    previewDisplayWidth={previewDisplayWidth}
                    previewDisplayHeight={previewDisplayHeight}
                    onTextPositionChange={handleTextPositionChange}
                  />
                </div>
                {/* Right Panel */}
                <div className="w-[420px] xl:w-[480px] border-l border-gray-200 bg-gray-50 overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={addTextSet}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
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
                          imageDimensions={imageDimensions}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);
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
  const navigate = useNavigate();

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
    if (!canvasRef.current || !imageDimensions) return;
    setIsProcessing(true);
    try {
      await document.fonts.ready;
      // Create an offscreen canvas with the original image's shape
      const offscreen = document.createElement('canvas');
      offscreen.width = imageDimensions.width;
      offscreen.height = imageDimensions.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      await canvasRef.current.renderToCanvas(ctx);
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

  const handleTextPositionChange = useCallback((textId: string, position: { x: number; y: number }) => {
    updateTextSet(textId, { position });
  }, [updateTextSet]);

  // Calculate full image preview dimensions with max constraints
  let previewDisplayWidth = 800;
  let previewDisplayHeight = 600;
  if (imageDimensions) {
    const maxWidth = 800;
    const maxHeight = 600;
    const aspect = imageDimensions.width / imageDimensions.height;
    
    if (aspect >= 1) {
      // Landscape or square
      previewDisplayWidth = Math.min(maxWidth, imageDimensions.width);
      previewDisplayHeight = previewDisplayWidth / aspect;
      if (previewDisplayHeight > maxHeight) {
        previewDisplayHeight = maxHeight;
        previewDisplayWidth = maxHeight * aspect;
      }
    } else {
      // Portrait
      previewDisplayHeight = Math.min(maxHeight, imageDimensions.height);
      previewDisplayWidth = previewDisplayHeight * aspect;
      if (previewDisplayWidth > maxWidth) {
        previewDisplayWidth = maxWidth;
        previewDisplayHeight = maxWidth / aspect;
      }
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          <div className="fade-in">
            <LandingPage 
              onGoViral={() => navigate('/signin')}
              onSignIn={() => navigate('/signin')}
            />
          </div>
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/editor" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;