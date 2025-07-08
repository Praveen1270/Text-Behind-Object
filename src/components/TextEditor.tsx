import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { TextSet } from '../hooks/useTextState';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface TextEditorProps {
  textSet: TextSet;
  onUpdate: (id: string, updates: Partial<TextSet>) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  imageDimensions: { width: number; height: number } | null;
}

// Expanded and alphabetically sorted font families (with 50+ new fonts)
const FONT_FAMILIES = [
  { name: 'Abel', weights: [400], hasItalic: false },
  { name: 'Acme', weights: [400], hasItalic: false },
  { name: 'Alfa Slab One', weights: [400], hasItalic: false },
  { name: 'Anton', weights: [400], hasItalic: false },
  { name: 'Archivo', weights: [400,700], hasItalic: false },
  { name: 'Archivo Black', weights: [400], hasItalic: false },
  { name: 'Arvo', weights: [400,700], hasItalic: false },
  { name: 'Asap', weights: [400,700], hasItalic: false },
  { name: 'Baloo 2', weights: [400,700], hasItalic: false },
  { name: 'Barlow', weights: [400,700], hasItalic: false },
  { name: 'Bebas Neue', weights: [400], hasItalic: false },
  { name: 'Bitter', weights: [400,700], hasItalic: false },
  { name: 'Black Ops One', weights: [400], hasItalic: false },
  { name: 'Bree Serif', weights: [400], hasItalic: false },
  { name: 'Cabin', weights: [400,700], hasItalic: false },
  { name: 'Caveat', weights: [400,700], hasItalic: false },
  { name: 'Chivo', weights: [400,700], hasItalic: false },
  { name: 'Cinzel', weights: [400,700], hasItalic: false },
  { name: 'Comfortaa', weights: [400,700], hasItalic: false },
  { name: 'Cookie', weights: [400], hasItalic: false },
  { name: 'Corben', weights: [400,700], hasItalic: false },
  { name: 'Crete Round', weights: [400], hasItalic: false },
  { name: 'Crimson Text', weights: [400,700], hasItalic: false },
  { name: 'DM Sans', weights: [400,700], hasItalic: false },
  { name: 'Didact Gothic', weights: [400], hasItalic: false },
  { name: 'Domine', weights: [400,700], hasItalic: false },
  { name: 'EB Garamond', weights: [400,700], hasItalic: false },
  { name: 'Encode Sans', weights: [400,700], hasItalic: false },
  { name: 'Exo 2', weights: [400,700], hasItalic: false },
  { name: 'Fira Sans', weights: [400,700], hasItalic: false },
  { name: 'Fjalla One', weights: [400], hasItalic: false },
  { name: 'Fredoka One', weights: [400], hasItalic: false },
  { name: 'Gloock', weights: [400,700], hasItalic: false },
  { name: 'Gloria Hallelujah', weights: [400], hasItalic: false },
  { name: 'Great Vibes', weights: [400], hasItalic: false },
  { name: 'Heebo', weights: [400,700], hasItalic: false },
  { name: 'Hind', weights: [400,700], hasItalic: false },
  { name: 'IBM Plex Sans', weights: [100,200,300,400,500,600,700], hasItalic: true },
  { name: 'Inconsolata', weights: [400,700], hasItalic: false },
  { name: 'Indie Flower', weights: [400], hasItalic: false },
  { name: 'Inter', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Josefin Sans', weights: [400,700], hasItalic: false },
  { name: 'Julius Sans One', weights: [400], hasItalic: false },
  { name: 'Kalam', weights: [400,700], hasItalic: false },
  { name: 'Kanit', weights: [400,700], hasItalic: false },
  { name: 'Karla', weights: [400,700], hasItalic: false },
  { name: 'Khand', weights: [400,700], hasItalic: false },
  { name: 'Koulen', weights: [400], hasItalic: false },
  { name: 'Lato', weights: [100,300,400,700,900], hasItalic: true },
  { name: 'Lexend', weights: [400,700], hasItalic: false },
  { name: 'Libre Baskerville', weights: [400,700], hasItalic: false },
  { name: 'Lobster', weights: [400], hasItalic: false },
  { name: 'Luckiest Guy', weights: [400], hasItalic: false },
  { name: 'Manrope', weights: [400,700], hasItalic: false },
  { name: 'Marcellus', weights: [400], hasItalic: false },
  { name: 'Markazi Text', weights: [400,700], hasItalic: false },
  { name: 'Merriweather', weights: [300,400,700,900], hasItalic: true },
  { name: 'Metrophobic', weights: [400], hasItalic: false },
  { name: 'Montserrat', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Mulish', weights: [400,700], hasItalic: false },
  { name: 'Neucha', weights: [400], hasItalic: false },
  { name: 'Noto Sans', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Noticia Text', weights: [400,700], hasItalic: false },
  { name: 'Nunito', weights: [200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Open Sans', weights: [300,400,500,600,700,800], hasItalic: true },
  { name: 'Orbitron', weights: [400,700], hasItalic: false },
  { name: 'Oswald', weights: [200,300,400,500,600,700], hasItalic: false },
  { name: 'Overpass', weights: [400,700], hasItalic: false },
  { name: 'Pacifico', weights: [400], hasItalic: false },
  { name: 'Pathway Gothic One', weights: [400], hasItalic: false },
  { name: 'Permanent Marker', weights: [400], hasItalic: false },
  { name: 'Philosopher', weights: [400,700], hasItalic: false },
  { name: 'Playfair Display', weights: [400,500,600,700,800,900], hasItalic: true },
  { name: 'Pontano Sans', weights: [400], hasItalic: false },
  { name: 'Poppins', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Quicksand', weights: [400,700], hasItalic: false },
  { name: 'Questrial', weights: [400], hasItalic: false },
  { name: 'Raleway', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Righteous', weights: [400], hasItalic: false },
  { name: 'Roboto', weights: [100,300,400,500,700,900], hasItalic: true },
  { name: 'Roboto Flex', weights: [100,200,300,400,500,600,700,800,900,1000], hasItalic: false },
  { name: 'Rokkitt', weights: [400,700], hasItalic: false },
  { name: 'Rowdies', weights: [400,700], hasItalic: false },
  { name: 'Russo One', weights: [400], hasItalic: false },
  { name: 'Secular One', weights: [400], hasItalic: false },
  { name: 'Shadows Into Light', weights: [400], hasItalic: false },
  { name: 'Signika', weights: [400,700], hasItalic: false },
  { name: 'Slabo 27px', weights: [400], hasItalic: false },
  { name: 'Source Sans Pro', weights: [200,300,400,600,700,900], hasItalic: true },
  { name: 'Spartan', weights: [400,700], hasItalic: false },
  { name: 'Staatliches', weights: [400], hasItalic: false },
  { name: 'Syncopate', weights: [400,700], hasItalic: false },
  { name: 'Teko', weights: [400,700], hasItalic: false },
  { name: 'Titillium Web', weights: [400,700], hasItalic: false },
  { name: 'Ubuntu', weights: [300,400,500,700], hasItalic: true },
  { name: 'Unica One', weights: [400], hasItalic: false },
  { name: 'Varela Round', weights: [400], hasItalic: false },
  { name: 'Vollkorn', weights: [400,700], hasItalic: false },
  { name: 'Work Sans', weights: [100,200,300,400,500,600,700,800,900], hasItalic: true },
  { name: 'Yanone Kaffeesatz', weights: [400,700], hasItalic: false },
  { name: 'Zilla Slab', weights: [400,700], hasItalic: false }
].sort((a, b) => a.name.localeCompare(b.name));

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

  // Get current font info
  const currentFont = FONT_FAMILIES.find(font => font.name === textSet.fontFamily) || FONT_FAMILIES[0];

  // Get font CSS class for preview
  const getFontClass = (fontName: string) => {
    const fontClassMap: { [key: string]: string } = {
      'Inter': 'font-inter',
      'Roboto Flex': 'font-roboto-flex',
      'Open Sans': 'font-open-sans',
      'Noto Sans': 'font-noto-sans',
      'IBM Plex Sans': 'font-ibm-plex-sans',
      'Lato': 'font-lato',
      'Montserrat': 'font-montserrat',
      'Source Sans Pro': 'font-source-sans-pro',
      'Raleway': 'font-raleway',
      'Poppins': 'font-poppins',
      'Oswald': 'font-oswald',
      'Playfair Display': 'font-playfair-display',
      'Merriweather': 'font-merriweather',
      'Roboto': 'font-roboto',
      'Nunito': 'font-nunito',
      'Ubuntu': 'font-ubuntu',
      'Work Sans': 'font-work-sans',
      // new fonts: no custom class needed
    };
    return fontClassMap[fontName] || '';
  };

  return (
    <div className={cn("border rounded-lg border-gray-200 bg-white shadow-sm text-editor-enter-active p-2 sm:p-4 w-full max-w-xl mx-auto", isExpanded && "text-movement")}>
      {/* Header */}
      <div 
        className="flex items-center justify-between p-2 sm:p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium text-gray-900 truncate text-base sm:text-lg">
          {textSet.text || 'Text Set'}
        </span>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500 transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 transition-transform" />
          )}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-2 sm:p-4 border-t space-y-4 border-gray-200">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor={`text-${textSet.id}`}>Text Content</Label>
            <input
              id={`text-${textSet.id}`}
              type="text"
              value={textSet.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              placeholder="Enter text..."
              className="w-full p-2 rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base sm:text-lg"
            />
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label htmlFor={`font-family-${textSet.id}`}>Font Family</Label>
            <Select value={textSet.fontFamily} onValueChange={(value) => handleUpdate({ fontFamily: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-y-auto">
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.name} value={font.name}>
                    <span className="font-medium">{font.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <Label htmlFor={`font-size-${textSet.id}`}>Font Size</Label>
            <Slider
              value={[textSet.fontSize]}
              onValueChange={([value]) => handleUpdate({ fontSize: value })}
              min={12}
              max={800}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">
              {textSet.fontSize}px
            </div>
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <Label htmlFor={`font-weight-${textSet.id}`}>Font Weight</Label>
            <Slider
              value={[textSet.fontWeight]}
              onValueChange={([value]) => handleUpdate({ fontWeight: value })}
              min={Math.min(...currentFont.weights)}
              max={Math.max(...currentFont.weights)}
              step={100}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">
              {textSet.fontWeight}
            </div>
          </div>

          {/* Font Style (Italic) */}
          {currentFont.hasItalic && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`font-style-${textSet.id}`}
                checked={textSet.fontStyle === 'italic'}
                onCheckedChange={(checked) => handleUpdate({ fontStyle: checked ? 'italic' : 'normal' })}
              />
              <Label htmlFor={`font-style-${textSet.id}`} className="text-sm">
                Italic Style
              </Label>
            </div>
          )}

          {/* Text Color */}
          <div className="space-y-2">
            <Label htmlFor={`color-${textSet.id}`}>Text Color</Label>
            <div className="flex items-center space-x-2">
              <input
                id={`color-${textSet.id}`}
                type="color"
                value={textSet.textColor}
                onChange={(e) => handleUpdate({ textColor: e.target.value })}
                className="w-full h-10 rounded-md border cursor-pointer transition-all hover:scale-105"
              />
            </div>
          </div>

          {/* Position Controls */}
          <div className="space-y-4">
            <Label>Position</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">X Position</Label>
                <Slider
                  value={[textSet.position.x]}
                  onValueChange={([value]) => handleUpdate({ position: { ...textSet.position, x: value } })}
                  max={maxX}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(textSet.position.x)}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Y Position</Label>
                <Slider
                  value={[textSet.position.y]}
                  onValueChange={([value]) => handleUpdate({ position: { ...textSet.position, y: value } })}
                  max={maxY}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 text-center">
                  {Math.round(textSet.position.y)}
                </div>
              </div>
            </div>
          </div>

          {/* Text Opacity */}
          <div className="space-y-2">
            <Label htmlFor={`opacity-${textSet.id}`}>Text Opacity</Label>
            <Slider
              value={[textSet.opacity]}
              onValueChange={([value]) => handleUpdate({ opacity: value })}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">
              {textSet.opacity}
            </div>
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label htmlFor={`rotation-${textSet.id}`}>Rotation</Label>
            <Slider
              value={[textSet.rotation]}
              onValueChange={([value]) => handleUpdate({ rotation: value })}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 text-center">
              {Math.round(textSet.rotation)}°
            </div>
          </div>

          {/* Text Shadow */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`text-shadow-${textSet.id}`}
              checked={textSet.textShadow}
              onCheckedChange={(checked) => handleUpdate({ textShadow: checked as boolean })}
            />
            <Label htmlFor={`text-shadow-${textSet.id}`} className="text-sm">
              Enable Text Shadow
            </Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => onDuplicate(textSet.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-sm border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all hover:scale-105"
            >
              <Copy className="w-3 h-3" />
              Duplicate
            </button>
            <button
              onClick={() => onRemove(textSet.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-all hover:scale-105"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};