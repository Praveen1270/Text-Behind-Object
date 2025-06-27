import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import { ImageUpload } from './components/ImageUpload';
import { TextEditor } from './components/TextEditor';
import { Canvas, CanvasHandle } from './components/Canvas';
import { useImageProcessor } from './hooks/useImageProcessor';
import { useTextState } from './hooks/useTextState';
import { Analytics } from '@vercel/analytics/react';
import LandingPage from './components/LandingPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/utils';

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1080;

// Placeholder SignIn and SignUp components
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess('Welcome back! Redirecting...');
    setTimeout(() => {
      navigate('/editor');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="w-full bg-[#0071e3] hover:bg-[#005bb5] text-white font-semibold py-2 px-4 rounded-lg transition">Sign In</button>
        </form>
        <div className="text-center mt-4 text-sm">
          Don't have an account? <a href="/signup" className="text-[#0071e3] hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess('Account created! Please check your email to confirm.');
    setTimeout(() => {
      navigate('/signin');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="w-full bg-[#0071e3] hover:bg-[#005bb5] text-white font-semibold py-2 px-4 rounded-lg transition">Sign Up</button>
        </form>
        <div className="text-center mt-4 text-sm">
          Already have an account? <a href="/signin" className="text-[#0071e3] hover:underline">Sign In</a>
        </div>
      </div>
    </div>
  );
};

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
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/signin');
    });
    // Optionally, subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/signin');
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, [navigate]);

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
              <h2 className="text-2xl font-medium mb-8 text-gray-900">
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
                canvasWidth={imageDimensions ? imageDimensions.width : CANVAS_WIDTH}
                canvasHeight={imageDimensions ? imageDimensions.height : CANVAS_HEIGHT}
                previewDisplayWidth={previewDisplayWidth}
                previewDisplayHeight={previewDisplayHeight}
                onTextPositionChange={handleTextPositionChange}
              />
            </div>
            {/* Right Panel */}
            <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
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
      <Route path="/signup" element={<SignUp />} />
      <Route path="/editor" element={<Editor />} />
      {/* Add your editor route here if needed */}
    </Routes>
  );
}

export default App;