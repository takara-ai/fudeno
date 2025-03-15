// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

import { ColorPaletteGenerator } from "./ColorPaletteGenerator";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FiDownload, FiRefreshCw, FiCopy } from "react-icons/fi";

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

  useEffect(() => {
    if (!logo) return;

    try {
      // Create a temporary div to hold the SVG
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = logo;

      // Get the SVG element
      const svgElement = tempDiv.querySelector("svg");
      if (!svgElement) {
        console.error("No SVG element found in logo");
        return;
      }

      // Set fixed dimensions for the SVG
      svgElement.setAttribute("width", "500");
      svgElement.setAttribute("height", "500");
      svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

      // Ensure viewBox exists
      const viewBox = svgElement.getAttribute("viewBox") || "0 0 512 512";
      svgElement.setAttribute("viewBox", viewBox);

      // Find all text elements and update them
      const textElements = svgElement.querySelectorAll("text");
      if (textElements.length > 0) {
        textElements.forEach((text) => {
          // Update font family and color
          text.setAttribute(
            "font-family",
            `'${fontSuggestions[selectedFont]}', sans-serif`
          );
          text.setAttribute("fill", `#${colors[selectedColor]}`);

          // Set text alignment
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "central");
        });
      }

      // Find all path elements and update their colors
      const pathElements = svgElement.querySelectorAll("path");
      pathElements.forEach((path) => {
        const fill = path.getAttribute("fill");
        if (fill && fill !== "none" && fill !== "transparent") {
          path.setAttribute("fill", `#${colors[selectedColor]}`);
        }

        const stroke = path.getAttribute("stroke");
        if (stroke && stroke !== "none" && stroke !== "transparent") {
          path.setAttribute("stroke", `#${colors[selectedColor]}`);
        }
      });

      // Set the updated SVG
      setCurrentLogo(tempDiv.innerHTML);
    } catch (error) {
      console.error("Error updating SVG:", error);
      setCurrentLogo(logo);
    }
  }, [logo, selectedFont, selectedColor, colors, fontSuggestions]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Function to create a data URL for the SVG
  const createSvgDataUrl = (svgContent: string) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
                <FiRefreshCw
                  className={`${isLoading ? "animate-spin" : ""} w-3.5 h-3.5`}
                />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C60F7B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        Brand Logo
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        Preview and download your customized logo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center space-y-5">
                    {/* SVG Preview Container */}
                    <div className="w-full bg-[#fafafa] rounded-lg p-4 border border-gray-100 overflow-hidden group hover:border-[#C60F7B] transition-all duration-300">
                      {/* SVG Preview */}
                      <div
                        className="flex justify-center items-center bg-white rounded-lg"
                        style={{ height: "500px" }}
                      >
                        {currentLogo && (
                          <img
                            src={createSvgDataUrl(currentLogo)}
                            alt="Logo Preview"
                            style={{
                              maxWidth: "500px",
                              maxHeight: "500px",
                              objectFit: "contain",
                            }}
                          />
                        )}
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
                          const svgBlob = new Blob([currentLogo], {
                            type: "image/svg+xml",
                          });
                          const url = URL.createObjectURL(svgBlob);
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext("2d");
                            ctx?.drawImage(img, 0, 0);
                            canvas.toBlob((pngBlob) => {
                              if (pngBlob) {
                                const pngUrl = URL.createObjectURL(pngBlob);
                                const a = document.createElement("a");
                                a.href = pngUrl;
                                a.download = `${companyName.toLowerCase()}-logo.png`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(pngUrl);
                              }
                            }, "image/png");
                          };
                          img.src = url;
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="group-hover:translate-y-0.5 transition-transform duration-300"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C60F7B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        Brand Preview
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        See how your brand elements work together
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {/* Typography Section */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[13px] font-medium text-gray-900">
                        Typography
                      </h4>
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

                  {/* Color Palette */}
                  <div className="p-6 space-y-6">
                    <h4 className="text-[13px] font-medium text-gray-900">
                      Color Palette
                    </h4>
                    <ColorPaletteGenerator
                      primaryColor={`#${colors[selectedColor]}`}
                    />
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C60F7B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <text
                          x="50%"
                          y="50%"
                          text-anchor="middle"
                          dy=".1em"
                          font-size="14"
                        >
                          Aa
                        </text>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-medium text-gray-900">
                        Customize Your Brand
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        Select your preferred font and color combinations
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="space-y-6">
                    {/* Font Selection */}
                    <div>
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">
                        Font Options
                      </h4>
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
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">
                                    Copied!
                                  </span>
                                )}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-500 mb-1.5">
                              {font}
                            </p>
                            <div
                              className="text-[15px] text-gray-900 transition-all duration-300"
                              style={{
                                fontFamily: `'${font}', sans-serif`,
                                opacity: document.fonts?.check(`12px '${font}'`)
                                  ? 1
                                  : 0.5,
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
                      <h4 className="text-[13px] font-medium text-gray-900 mb-3">
                        Color Options
                      </h4>
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
                                  <span className="ml-2 text-[11px] text-[#C60F7B]">
                                    Copied!
                                  </span>
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-14 h-14 rounded-md shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer"
                                style={{ backgroundColor: `#${color}` }}
                              />
                              <div className="space-y-1">
                                <code className="text-[13px] font-mono text-gray-600">
                                  #{color}
                                </code>
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
  if (!result) return "";
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `${r}, ${g}, ${b}`;
};

const hexToHsl = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%`;
};
