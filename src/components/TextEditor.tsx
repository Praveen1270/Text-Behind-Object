import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';

interface TextEditorProps {
  textSet: TextSet;
  onUpdate: (id: string, updates: Partial<TextSet>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDarkMode: boolean;
  imageDimensions: { width: number; height: number } | null;
}

const FONT_FAMILIES = [
  'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro',
  'Raleway', 'Poppins', 'Oswald', 'Playfair Display', 'Merriweather'
];

const PRESET_COLORS = [
  { name: 'white', value: '#FFFFFF' },
  { name: 'black', value: '#000000' },
  { name: 'red', value: '#EF4444' },
  { name: 'blue', value: '#3B82F6' },
  { name: 'green', value: '#10B981' },
  { name: 'yellow', value: '#F59E0B' },
  { name: 'purple', value: '#8B5CF6' },
  { name: 'pink', value: '#EC4899' }
];

export const TextEditor: React.FC<TextEditorProps> = ({
  textSet,
  onUpdate,
  onRemove,
  onDuplicate,
  isDarkMode,
  imageDimensions
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleUpdate = (updates: Partial<TextSet>) => {
    onUpdate(textSet.id, updates);
  };

  const maxX = imageDimensions?.width || 800;
  const maxY = imageDimensions?.height || 600;

  return (
    <div className={`border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer ${
          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {textSet.text || 'Text Set'}
        </span>
        {isExpanded ? (
          <ChevronUp className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={`p-4 border-t space-y-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
          {/* Text Input */}
          <div>
            <input
              type="text"
              value={textSet.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              placeholder="Enter text..."
              className={`w-full p-2 rounded border ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Font Family */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Font Family
            </label>
            <select
              value={textSet.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className={`w-full p-2 rounded border ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-800 text-white' 
                  : 'border-gray-300 bg-white text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Text Color
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="color"
                value={textSet.textColor}
                onChange={(e) => handleUpdate({ textColor: e.target.value })}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <select
                value={textSet.textColor}
                onChange={(e) => handleUpdate({ textColor: e.target.value })}
                className={`flex-1 p-2 rounded border ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-800 text-white' 
                    : 'border-gray-300 bg-white text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {PRESET_COLORS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Position Controls */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Math.round(textSet.position.x)}
                </span>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
                <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {Math.round(textSet.position.y)}
                </span>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Font Size
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="12"
                max="200"
                value={textSet.fontSize}
                onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.fontSize}
              </span>
            </div>
          </div>

          {/* Font Weight */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.fontWeight}
              </span>
            </div>
          </div>

          {/* Text Opacity */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.opacity}
              </span>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.rotation}°
              </span>
            </div>
          </div>

          {/* Horizontal Tilt */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Horizontal Tilt
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-45"
                max="45"
                value={textSet.horizontalTilt}
                onChange={(e) => handleUpdate({ horizontalTilt: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.horizontalTilt}°
              </span>
            </div>
          </div>

          {/* Vertical Tilt */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Vertical Tilt
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="-45"
                max="45"
                value={textSet.verticalTilt}
                onChange={(e) => handleUpdate({ verticalTilt: Number(e.target.value) })}
                className="flex-1"
              />
              <span className={`text-sm w-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {textSet.verticalTilt}°
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <button
              onClick={() => onDuplicate(textSet.id)}
              className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                isDarkMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-500' 
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              } transition-colors`}
            >
              Duplicate
            </button>
            <button
              onClick={() => onRemove(textSet.id)}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};