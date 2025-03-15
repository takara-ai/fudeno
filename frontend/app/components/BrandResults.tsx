// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

import { ColorPaletteGenerator } from "./ColorPaletteGenerator";
import { motion } from "framer-motion";
import { useState } from "react";
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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
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
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className="flex justify-between items-center"
        variants={item}
      >
        <h2 className="text-4xl font-bold text-gray-900">
          Your Brand Assets
        </h2>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-[#C60F7B] rounded-xl text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-500`} />
          {isLoading ? "Generating..." : "Generate New Options"}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Font and Color */}
        <div className="space-y-8">
          {/* Font Options */}
          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#C60F7B] transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Font Options</h3>
            <div className="space-y-6">
              {Object.entries(fontSuggestions).map(([key, font]) => (
                <div
                  key={key}
                  onClick={() => setSelectedFont(key)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    key === selectedFont
                      ? "border-[#C60F7B] bg-[#C60F7B]/5"
                      : "border-gray-200 hover:border-[#C60F7B]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      Option {key.slice(-1)}
                      {key === selectedFont && (
                        <span className="text-sm text-[#C60F7B]">
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
                      <FiCopy />
                      {copied === `font-${key}` && (
                        <span className="ml-2 text-xs text-[#C60F7B]">Copied!</span>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-600 mb-2">{font}</p>
                  <div
                    className="text-2xl text-gray-900 transition-all duration-300"
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
          </motion.div>

          {/* Color Options */}
          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#C60F7B] transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Color Options</h3>
            <div className="space-y-6">
              {Object.entries(colors).map(([key, color]) => (
                <div
                  key={key}
                  onClick={() => setSelectedColor(key)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    key === selectedColor
                      ? "border-[#C60F7B] bg-[#C60F7B]/5"
                      : "border-gray-200 hover:border-[#C60F7B]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      Option {key.slice(-1)}
                      {key === selectedColor && (
                        <span className="text-sm text-[#C60F7B]">
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
                      <FiCopy />
                      {copied === `color-${key}` && (
                        <span className="ml-2 text-xs text-[#C60F7B]">Copied!</span>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer"
                      style={{ backgroundColor: `#${color}` }}
                    />
                    <div>
                      <code className="text-sm text-gray-600">#{color}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Brand Preview */}
          <motion.div 
            variants={item}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#C60F7B] transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Brand Preview</h3>
            <div className="space-y-4">
              <div
                className="text-3xl font-bold transition-all duration-300"
                style={{
                  fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                  color: `#${colors[selectedColor]}`,
                }}
              >
                {companyName || "Your Company Name"}
              </div>
              <p
                className="text-lg transition-all duration-300"
                style={{
                  fontFamily: `'${fontSuggestions[selectedFont]}', sans-serif`,
                  color: `#${colors[selectedColor]}`,
                }}
              >
                {FONT_SHOWCASE_TEXT}
              </p>
            </div>
          </motion.div>

          {/* Color Palette Generator */}
          <motion.div variants={item}>
            <ColorPaletteGenerator primaryColor={`#${colors[selectedColor]}`} />
          </motion.div>
        </div>

        {/* Right Column: Logo */}
        <motion.div 
          variants={item}
          className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#C60F7B] transition-all duration-300 hover:shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Brand Logo</h3>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className="w-full max-w-[512px] h-auto bg-gray-50 rounded-xl p-8 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "auto",
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    logo?.replace(
                      "<svg",
                      '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet"'
                    ) || "",
                }}
              />
            </div>
            <button
              onClick={() => {
                const blob = new Blob([logo], {
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
              className="px-6 py-3 bg-[#C60F7B] rounded-xl text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md flex items-center gap-2 group"
            >
              <FiDownload className="group-hover:translate-y-1 transition-transform duration-300" />
              Download SVG
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
