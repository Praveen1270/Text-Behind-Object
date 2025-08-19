import { useState, useCallback } from 'react';

export interface TextSet {
  id: string;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic';
  textColor: string;
  fontWeight: number;
  opacity: number;
  rotation: number;
  horizontalTilt: number;
  verticalTilt: number;
  position: { x: number; y: number };
  textShadow: boolean;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number; // multiplier, e.g., 1.25
  letterSpacing?: number; // pixels per character
}

const createTextSet = (id?: string): TextSet => ({
  id: id || Date.now().toString(),
  text: 'edit',
  fontSize: 300,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  textColor: '#FFFFFF',
  fontWeight: 700,
  opacity: 1,
  rotation: 0,
  horizontalTilt: 0,
  verticalTilt: 0,
  position: { x: 100, y: 100 },
  textShadow: false,
  textAlign: 'left'
  ,
  lineHeight: 1.25,
  letterSpacing: 0
});

export const useTextState = () => {
  const [textSets, setTextSets] = useState<TextSet[]>([createTextSet()]);

  const addTextSet = useCallback(() => {
    setTextSets(prev => [...prev, createTextSet()]);
  }, []);

  const updateTextSet = useCallback((id: string, updates: Partial<TextSet>) => {
    setTextSets(prev => prev.map(textSet => 
      textSet.id === id ? { ...textSet, ...updates } : textSet
    ));
  }, []);

  const removeTextSet = useCallback((id: string) => {
    setTextSets(prev => prev.filter(textSet => textSet.id !== id));
  }, []);

  const duplicateTextSet = useCallback((id: string) => {
    setTextSets(prev => {
      const textSet = prev.find(t => t.id === id);
      if (!textSet) return prev;
      
      const duplicate = {
        ...textSet,
        id: Date.now().toString(),
        position: { x: textSet.position.x + 20, y: textSet.position.y + 20 }
      };
      
      return [...prev, duplicate];
    });
  }, []);

  return {
    textSets,
    addTextSet,
    updateTextSet,
    removeTextSet,
    duplicateTextSet
  };
};