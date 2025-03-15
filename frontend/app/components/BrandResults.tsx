// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

import { ColorPaletteGenerator } from "./ColorPaletteGenerator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiDownload, FiRefreshCw, FiCopy, FiMove, FiRotateCw, FiType, FiZoomIn, FiZoomOut } from "react-icons/fi";

interface BrandResultsProps {
  companyName: string;
  fontSuggestions: {
    option1: string;
    option2: string;
    option3: string;
  };
  colors: {
    option1: string;
    option2: string;
    option3: string;
  };
  logo: string;
  onRegenerate: () => Promise<void>;
  isLoading: boolean;
}

export const BrandResults = ({
  companyName,
  fontSuggestions,
  colors,
  logo,
  onRegenerate,
  isLoading,
}: BrandResultsProps) => {
  const [selectedFont, setSelectedFont] = useState<string>("option1");
  const [selectedColor, setSelectedColor] = useState<string>("option1");
  const [copied, setCopied] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState(logo);
  const [textScale, setTextScale] = useState(1);
  const [textRotation, setTextRotation] = useState(0);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 }); // We'll set this dynamically
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(companyName);

  useEffect(() => {
    if (!logo) return;
    
    try {
      // Create a temporary div to hold the SVG
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = logo;
      
      // Get the SVG element
      const svgElement = tempDiv.querySelector('svg');
      if (!svgElement) {
        console.error('No SVG element found in logo');
        return;
      }
      
      // Set SVG attributes for proper display
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      
      // Find all text elements and update them
      const textElements = svgElement.querySelectorAll('text');
      if (textElements.length > 0) {
        textElements.forEach(text => {
          // Update font family and color
          text.setAttribute('font-family', `'${fontSuggestions[selectedFont]}', sans-serif`);
          text.setAttribute('fill', `#${colors[selectedColor]}`);
          
          // Set text alignment
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'central');
          
          // Set position if needed
          if (textPosition.x !== 0 || textPosition.y !== 0) {
            text.setAttribute('x', textPosition.x.toString());
            text.setAttribute('y', textPosition.y.toString());
            
            // Apply transformations
            if (textRotation !== 0 || textScale !== 1) {
              text.setAttribute('transform', `rotate(${textRotation} ${textPosition.x} ${textPosition.y}) scale(${textScale})`);
            }
          }
          
          // Handle long text with wrapping
          const displayText = isEditing ? editedText + '|' : (editedText !== companyName ? editedText : text.textContent);
          if (displayText) {
            // Clear existing text content and tspans
            while (text.firstChild) {
              text.removeChild(text.firstChild);
            }
            
            // For longer text, split into multiple lines
            if (displayText.length > 15) {
              // Calculate how many characters per line based on text length
              const charsPerLine = displayText.length > 30 ? 15 : 20;
              const words = displayText.split(' ');
              let lines = [];
              let currentLine = '';
              
              // Create lines of appropriate length
              words.forEach(word => {
                if ((currentLine + word).length <= charsPerLine) {
                  currentLine += (currentLine ? ' ' : '') + word;
                } else {
                  lines.push(currentLine);
                  currentLine = word;
                }
              });
              if (currentLine) lines.push(currentLine);
              
              // Add each line as a tspan
              lines.forEach((line, index) => {
                const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspan.textContent = line;
                tspan.setAttribute('x', textPosition.x.toString());
                tspan.setAttribute('dy', index === 0 ? '0' : '1.2em');
                text.appendChild(tspan);
              });
              
              // If editing, add cursor to last line
              if (isEditing) {
                const lastTspan = text.lastChild as SVGTSpanElement;
                if (lastTspan) {
                  lastTspan.textContent = lastTspan.textContent?.replace('|', '') + '|';
                }
              }
            } else {
              // For shorter text, just set the content directly
              text.textContent = displayText;
            }
          }
        });
      }
      
      // Find all path elements and update their colors
      const pathElements = svgElement.querySelectorAll('path');
      pathElements.forEach(path => {
        const fill = path.getAttribute('fill');
        if (fill && fill !== 'none' && fill !== 'transparent') {
          path.setAttribute('fill', `#${colors[selectedColor]}`);
        }
        
        const stroke = path.getAttribute('stroke');
        if (stroke && stroke !== 'none' && stroke !== 'transparent') {
          path.setAttribute('stroke', `#${colors[selectedColor]}`);
        }
      });
      
      // Set the updated SVG
      setCurrentLogo(tempDiv.innerHTML);
    } catch (error) {
      console.error('Error updating SVG:', error);
      setCurrentLogo(logo);
    }
  }, [logo, selectedFont, selectedColor, textPosition, textRotation, textScale, isEditing, editedText, companyName, colors, fontSuggestions]);

  // Update movement handlers for better control
  const handleMove = (dx: number, dy: number) => {
    setTextPosition(prev => {
      // Simple boundary check
      const newX = Math.max(50, Math.min(450, prev.x + dx));
      const newY = Math.max(50, Math.min(450, prev.y + dy));
      return { x: newX, y: newY };
    });
  };

  // Initialize text position if not set
  useEffect(() => {
    if (textPosition.x === 0 && textPosition.y === 0) {
      setTextPosition({ x: 256, y: 256 });
    }
  }, [textPosition]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRotate = (angle: number) => {
    setTextRotation(prev => {
      const newRotation = (prev + angle) % 360;
      return newRotation < 0 ? newRotation + 360 : newRotation;
    });
  };

  const handleScale = (factor: number) => {
    setTextScale(prev => Math.max(0.1, Math.min(5, prev * factor)));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#f5f5f5] w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="max-w-[1920px] mx-auto px-8 py-8">
        <div className="space-y-6">
          {/* Header Card */}
          <motion.div 
            variants={item}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="px-5 py-4 flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-[24px] font-medium text-gray-900">
                  Your Brand Assets
                </h2>
                <p className="text-[13px] text-gray-500">
                  Customize your brand identity with the options below
                </p>
              </div>
              <button
                onClick={onRegenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-[#C60F7B] rounded-md text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-[13px] font-medium"
              >
                <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''} w-3.5 h-3.5`} />
                {isLoading ? "Generating..." : "Generate New Options"}
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Brand Preview & Logo */}
            <div className="col-span-8 space-y-6">
              {/* Brand Logo Preview */}
              <motion.div 
                variants={item}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C60F7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">Brand Logo</h3>
                      <p className="text-[13px] text-gray-500">Preview and download your customized logo</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-5">
                    {/* SVG Preview Container */}
                    <div className="w-full bg-[#fafafa] rounded-lg p-6 border border-gray-100 overflow-hidden group hover:border-[#C60F7B] transition-all duration-300">
                      {/* Simple SVG Editor Toolbar */}
                      <div className="flex items-center justify-center gap-1 mb-6">
                        {/* Movement Controls */}
                        <button
                          onClick={() => handleMove(-10, 0)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => handleMove(10, 0)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          →
                        </button>
                        <button
                          onClick={() => handleMove(0, -10)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(0, 10)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          ↓
                        </button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* Rotation Controls */}
                        <button
                          onClick={() => handleRotate(-15)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          ↺
                        </button>
                        <button
                          onClick={() => handleRotate(15)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          ↻
                        </button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* Scale Controls */}
                        <button
                          onClick={() => handleScale(0.9)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          −
                        </button>
                        <button
                          onClick={() => handleScale(1.1)}
                          className="p-2.5 border border-gray-200 rounded-lg hover:border-[#C60F7B] transition-all"
                        >
                          +
                        </button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* Text Editing */}
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className={`p-2.5 border rounded-lg transition-all ${
                            isEditing ? 'border-[#C60F7B] bg-[#C60F7B] text-white' : 'border-gray-200 hover:border-[#C60F7B]'
                          }`}
                        >
                          T
                        </button>
                        {isEditing && (
                          <div className="relative ml-2 flex-1">
                            <textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className="w-full min-w-[200px] px-3 py-1.5 border border-gray-200 rounded-lg focus:border-[#C60F7B] focus:outline-none text-center resize-none"
                              placeholder="Edit text..."
                              rows={2}
                              autoFocus
                            />
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center">
                              <span className="text-[#C60F7B] animate-pulse text-xs">Click T again to finish editing</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SVG Preview */}
                      <div className="w-full h-[350px] bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        <div 
                          dangerouslySetInnerHTML={{
                            __html: currentLogo || "",
                          }}
                          className="w-[300px] h-[300px]"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => {
                          const blob = new Blob([currentLogo], {
                            type: "image/svg+xml",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${companyName.toLowerCase()}-logo.svg`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="flex-1 px-4 py-2 bg-[#C60F7B] rounded-md text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                      >
                        <FiDownload className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-300" />
                        Download SVG
                      </button>
                      <button
                        className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-md hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm flex items-center justify-center gap-2 group text-[13px] font-medium"
                        onClick={() => {
                          const svgBlob = new Blob([currentLogo], { type: 'image/svg+xml' });
                          const url = URL.createObjectURL(svgBlob);
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx?.drawImage(img, 0, 0);
                            canvas.toBlob((pngBlob) => {
                              if (pngBlob) {
                                const pngUrl = URL.createObjectURL(pngBlob);
                                const a = document.createElement('a');
                                a.href = pngUrl;
                                a.download = `${companyName.toLowerCase()}-logo.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(pngUrl);
                              }
                            }, 'image/png');
                          };
                          img.src = url;
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform duration-300"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download PNG
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Brand Preview */}
              <motion.div 
                variants={item}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C60F7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">Brand Preview</h3>
                      <p className="text-[13px] text-gray-500">See how your brand elements work together</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* Typography Section */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-medium text-gray-900">Typography</h4>
                      <div className="space-y-6">
                        <div
                          className="text-[42px] font-bold leading-tight transition-all duration-300"
                          style={{
                            fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            color: `#${colors[selectedColor]}`,
                          }}
                        >
                          {companyName || "Your Company Name"}
                        </div>
                        <div className="space-y-3">
                          <div
                            className="text-[32px] font-semibold transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H1 - Main Heading
                          </div>
                          <div
                            className="text-[24px] font-medium transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H2 - Section Heading
                          </div>
                          <div
                            className="text-[20px] font-medium transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            H3 - Subsection Heading
                          </div>
                          <div
                            className="text-[16px] leading-relaxed transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            Body text - {FONT_SHOWCASE_TEXT}
                          </div>
                          <div
                            className="text-[14px] text-gray-600 transition-all duration-300"
                            style={{
                              fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                            }}
                          >
                            Caption text - Additional information and metadata
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Applications */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-[13px] font-medium text-gray-900">Color Applications</h4>
                    <div className="space-y-6">
                      {/* Buttons */}
                      {/* <div className="space-y-3">
                        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Buttons</h5>
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-4 py-2 rounded-md text-white text-[13px] font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-md shadow-sm"
                            style={{ backgroundColor: `#${colors[selectedColor]}` }}
                          >
                            Primary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-[13px] font-medium border transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                            style={{ 
                              borderColor: `#${colors[selectedColor]}`,
                              color: `#${colors[selectedColor]}`
                            }}
                          >
                            Secondary Button
                          </button>
                          <button
                            className="px-4 py-2 rounded-md text-[13px] font-medium transition-all duration-300 hover:scale-[1.02]"
                            style={{ color: `#${colors[selectedColor]}` }}
                          >
                            Text Button
                          </button>
                        </div>
                      </div> */}

                      {/* Tags & Badges */}
                      {/* <div className="space-y-3">
                        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Tags & Badges</h5>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="px-2.5 py-1 rounded-full text-white text-[12px] font-medium"
                            style={{ backgroundColor: `#${colors[selectedColor]}` }}
                          >
                            New
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-[12px] font-medium border"
                            style={{ 
                              borderColor: `#${colors[selectedColor]}`,
                              color: `#${colors[selectedColor]}`
                            }}
                          >
                            Tag
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-full text-[12px] font-medium"
                            style={{ 
                              backgroundColor: `#${colors[selectedColor]}20`,
                              color: `#${colors[selectedColor]}`
                            }}
                          >
                            Label
                          </span>
                        </div>
                      </div> */}

                      {/* Interactive Elements */}
                      {/* <div className="space-y-3">
                        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Interactive Elements</h5>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border-2 flex items-center justify-center"
                              style={{ borderColor: `#${colors[selectedColor]}` }}
                            >
                              <div
                                className="w-2 h-2 rounded-sm"
                                style={{ backgroundColor: `#${colors[selectedColor]}` }}
                              />
                            </div>
                            <label className="text-[13px]">Checkbox example</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                              style={{ borderColor: `#${colors[selectedColor]}` }}
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: `#${colors[selectedColor]}` }}
                              />
                            </div>
                            <label className="text-[13px]">Radio button example</label>
                          </div>
                          <div
                            className="w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200"
                            style={{ backgroundColor: `#${colors[selectedColor]}` }}
                          >
                            <div className="absolute left-[2px] top-[2px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 transform translate-x-6" />
                          </div>
                        </div>
                      </div> */}

                      {/* Cards & Containers */}
                      {/* <div className="space-y-3">
                        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">Cards & Containers</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className="p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md"
                            style={{ borderColor: `#${colors[selectedColor]}` }}
                          >
                            <div
                              className="text-[13px] font-medium mb-1"
                              style={{ color: `#${colors[selectedColor]}` }}
                            >
                              Featured Card
                            </div>
                            <p className="text-[12px] text-gray-600">
                              With branded border
                            </p>
                          </div>
                          <div className="p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
                            <div
                              className="text-[13px] font-medium mb-1"
                              style={{ color: `#${colors[selectedColor]}` }}
                            >
                              Regular Card
                            </div>
                            <p className="text-[12px] text-gray-600">
                              With accent text
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-[13px] font-medium text-gray-900">Color Palette</h4>
                    <ColorPaletteGenerator primaryColor={`#${colors[selectedColor]}`} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Customization Options */}
            <div className="col-span-4 space-y-6">
              {/* Font Options */}
              <motion.div 
                variants={item}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="border-b border-gray-100 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#C60F7B]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C60F7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><text x="50%" y="50%" text-anchor="middle" dy=".1em" font-size="14">Aa</text></svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">Customize Your Brand</h3>
                      <p className="text-[13px] text-gray-500">Select your preferred font and color combinations</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-6">
                    {/* Font Selection */}
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">Font Options</h4>
                      <div className="space-y-2">
                        {Object.entries(fontSuggestions).map(([key, font]) => (
                          <div
                            key={key}
                            onClick={() => setSelectedFont(key)}
                            className={`p-3 rounded-md border cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
                              key === selectedFont
                                ? "border-[#C60F7B] bg-[#C60F7B]/5"
                                : "border-gray-200 hover:border-[#C60F7B]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[13px] font-medium text-gray-900 flex items-center gap-2">
                                Option {key.slice(-1)}
                                {key === selectedFont && (
                                  <span className="text-[11px] text-[#C60F7B]">
                                    (Selected)
                                  </span>
                                )}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(font, `font-${key}`);
                                }}
                                className="text-gray-400 hover:text-[#C60F7B] transition-colors"
                              >
                                <FiCopy size={12} />
                                {copied === `font-${key}` && (
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">Copied!</span>
                                )}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mb-1.5">{font}</p>
                            <div
                              className="text-[15px] text-gray-900 transition-all duration-300"
                              style={{
                                fontFamily: `'${font}', sans-serif`,
                                opacity: document.fonts?.check(`12px '${font}'`) ? 1 : 0.5,
                              }}
                            >
                              {FONT_SHOWCASE_TEXT}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">Color Options</h4>
                      <div className="space-y-2">
                        {Object.entries(colors).map(([key, color]) => (
                          <div
                            key={key}
                            onClick={() => setSelectedColor(key)}
                            className={`p-3 rounded-md border cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
                              key === selectedColor
                                ? "border-[#C60F7B] bg-[#C60F7B]/5"
                                : "border-gray-200 hover:border-[#C60F7B]"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[13px] font-medium text-gray-900 flex items-center gap-2">
                                Option {key.slice(-1)}
                                {key === selectedColor && (
                                  <span className="text-[11px] text-[#C60F7B]">
                                    (Selected)
                                  </span>
                                )}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(`#${color}`, `color-${key}`);
                                }}
                                className="text-gray-400 hover:text-[#C60F7B] transition-colors"
                              >
                                <FiCopy size={12} />
                                {copied === `color-${key}` && (
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">Copied!</span>
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-14 h-14 rounded-md shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: `#${color}` }}
                              />
                              <div className="space-y-1">
                                <code className="text-[13px] font-mono text-gray-600">#{color}</code>
                                <div className="flex flex-col gap-1">
                                  <div className="px-2 py-1 bg-gray-50 rounded text-[11px] text-gray-600">
                                    RGB: {hexToRgb(`#${color}`)}
                                  </div>
                                  <div className="px-2 py-1 bg-gray-50 rounded text-[11px] text-gray-600">
                                    HSL: {hexToHsl(`#${color}`)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions for color conversion
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
};

const hexToHsl = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '';
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
};
