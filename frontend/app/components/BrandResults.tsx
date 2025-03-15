// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

import { ColorPaletteGenerator } from "./ColorPaletteGenerator";

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
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-[#C60F7B]">Your Brand Assets</h2>
        <button
          onClick={onRegenerate}
          disabled={isLoading}
          className="px-6 py-2 bg-[#C60F7B] rounded-lg hover:bg-[#A00C63] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Generate New Options"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Font and Color */}
        <div className="space-y-8">
          {/* Font Options */}
          <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
            <h3 className="text-xl font-semibold mb-4">Font Options</h3>
            <div className="space-y-6">
              {Object.entries(fontSuggestions).map(([key, font]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    key === "option1"
                      ? "border-[#C60F7B] bg-[#C60F7B]/20"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Option {key.slice(-1)}
                      {key === "option1" && (
                        <span className="ml-2 text-sm text-[#C60F7B]">
                          (Used in Logo)
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="text-gray-400 mb-2">{font}</p>
                  <div
                    className="text-2xl"
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

          {/* Color Options */}
          <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
            <h3 className="text-xl font-semibold mb-4">Color Options</h3>
            <div className="space-y-6">
              {Object.entries(colors).map(([key, color]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 ${
                    key === "option1"
                      ? "border-[#C60F7B] bg-[#C60F7B]/20"
                      : "border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Option {key.slice(-1)}
                      {key === "option1" && (
                        <span className="ml-2 text-sm text-[#C60F7B]">
                          (Used in Logo)
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-lg shadow-lg"
                      style={{ backgroundColor: `#${color}` }}
                    />
                    <div>
                      <code className="text-sm">#{color}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Preview */}
          <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
            <h3 className="text-xl font-semibold mb-4">
              Brand Preview (Using Option 1)
            </h3>
            <div className="space-y-4">
              <div
                className="text-3xl font-bold"
                style={{
                  fontFamily: `'${fontSuggestions.option1}', sans-serif`,
                  color: `#${colors.option1}`,
                }}
              >
                {companyName || "Your Company Name"}
              </div>
              <p
                className="text-lg"
                style={{
                  fontFamily: `'${fontSuggestions.option1}', sans-serif`,
                  color: `#${colors.option1}`,
                }}
              >
                {FONT_SHOWCASE_TEXT}
              </p>
            </div>
          </div>

          {/* Color Palette Generator */}
          <ColorPaletteGenerator primaryColor={`#${colors.option1}`} />
        </div>

        {/* Right Column: Logo */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
          <h3 className="text-xl font-semibold mb-4">
            Brand Logo (Using Option 1)
          </h3>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className="w-full max-w-[512px] h-auto bg-white rounded-lg p-4 shadow-lg overflow-hidden"
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
              className="px-6 py-2 bg-[#C60F7B] rounded-lg hover:bg-[#A00C63] transition-all duration-300"
            >
              Download SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
