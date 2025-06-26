import { useState, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';

export const useImageProcessor = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [foregroundImage, setForegroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const processImage = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      // Create original image URL
      const originalImageUrl = URL.createObjectURL(file);
      
      // Remove background to get foreground
      const foregroundBlob = await removeBackground(file);
      const foregroundUrl = URL.createObjectURL(foregroundBlob);
      setForegroundImage(foregroundUrl);

      // Create background by removing the foreground
      // For now, we'll use the original as background
      // In a more advanced version, we could inpaint the background
      setBackgroundImage(originalImageUrl);
      
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    backgroundImage,
    foregroundImage,
    processImage,
    isLoading
  };
};