import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';

interface TextEditorProps {
  textSet: TextSet;
  onUpdate: (id: string, updates: Partial<TextSet>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  imageDimensions: { width: number; height: number } | null;
}

const FONT_FAMILIES = [
  'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
  'Raleway', 'Poppins', 'Oswald', 'Playfair Display', 'Merriweather'
];

export const TextEditor: React.FC<TextEditorProps> = ({
  textSet,
  onUpdate,
  onRemove,
  onDuplicate,
  imageDimensions
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (updates: Partial<TextSet>) => {
    onUpdate(textSet.id, updates);
  };

  const maxX = imageDimensions?.width || 800;
  const maxY = imageDimensions?.height || 600;

  return (
    <div className={`border rounded-lg border-gray-200 bg-white`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={`font-medium text-gray-900`}>
          {textSet.text || 'Text Set'}
        </span>
        {isExpanded ? (
          <ChevronUp className={`w-4 h-4 text-gray-500`} />
        ) : (
          <ChevronDown className={`w-4 h-4 text-gray-500`} />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={`p-4 border-t space-y-4 border-gray-200`}>
          {/* Text Input */}
          <div>
            <input
              type="text"
              value={textSet.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              placeholder="Enter text..."
              className={`w-full p-2 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Font Family */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Font Family
            </label>
            <select
              value={textSet.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className={`w-full p-2 rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Text Color */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Text Color
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="color"
                value={textSet.textColor}
                onChange={(e) => handleUpdate({ textColor: e.target.value })}
                className="w-full h-8 rounded border cursor-pointer"
              />
            </div>
          </div>

          {/* Position Controls */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 text-gray-700`}>
                Y Position
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max={maxY}
                  value={textSet.position.y}
                  onChange={(e) => handleUpdate({ position: { ...textSet.position, y: Number(e.target.value) } })}
                  className="flex-1"
                />
                <span className={`text-sm w-12 text-gray-600`}>
                  {Math.round(textSet.position.y)}
                </span>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 text-gray-700`}>
                X Position
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max={maxX}
                  value={textSet.position.x}
                  onChange={(e) => handleUpdate({ position: { ...textSet.position, x: Number(e.target.value) } })}
                  className="flex-1"
                />
                <span className={`text-sm w-12 text-gray-600`}>
                  {Math.round(textSet.position.x)}
                </span>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Font Size
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="12"
                max="400"
                value={textSet.fontSize}
                onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 text-gray-600`}>
                {textSet.fontSize}
              </span>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Font Weight
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="100"
                max="900"
                step="100"
                value={textSet.fontWeight}
                onChange={(e) => handleUpdate({ fontWeight: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 text-gray-600`}>
                {textSet.fontWeight}
              </span>
            </div>
          </div>

          {/* Text Opacity */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Text Opacity
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={textSet.opacity}
                onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 text-gray-600`}>
                {textSet.opacity}
              </span>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className={`block text-sm font-medium mb-1 text-gray-700`}>
              Rotation
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-180"
                max="180"
                value={textSet.rotation}
                onChange={(e) => handleUpdate({ rotation: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 text-gray-600`}>
                {Math.round(textSet.rotation)}°
              </span>
            </div>
          </div>

          {/* Text Shadow */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`text-shadow-${textSet.id}`}
              checked={textSet.textShadow}
              onChange={(e) => handleUpdate({ textShadow: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={`text-shadow-${textSet.id}`} className="ml-2 block text-sm text-gray-900">
              Enable Text Shadow
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => onDuplicate(textSet.id)}
              className={`px-3 py-1 rounded text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors`}
            >
              Duplicate
            </button>
            <button
              onClick={() => onRemove(textSet.id)}
              className={`px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors`}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};