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
}

const createTextSet = (id?: string): TextSet => ({
  id: id || Date.now().toString(),
  text: 'edit',
  fontSize: 48,
  fontFamily: 'Inter',
  fontStyle: 'normal',
  textColor: '#FFFFFF',
  fontWeight: 700,
  opacity: 1,
  rotation: 0,
  horizontalTilt: 0,
  verticalTilt: 0,
  position: { x: 100, y: 100 },
  textShadow: false
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