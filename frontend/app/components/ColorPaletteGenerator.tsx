import { useState } from "react";
import { FiCopy } from "react-icons/fi";

interface ColorPaletteGeneratorProps {
  primaryColor: string;
}

interface ColorScheme {
  name: string;
  colors: string[];
  description: string;
}

export const ColorPaletteGenerator = ({
  primaryColor,
}: ColorPaletteGeneratorProps) => {
  const [selectedScheme, setSelectedScheme] = useState<string>("complementary");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
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

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Convert hex to HSL
  const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max !== min) {
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
    } else {
      s = 0;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to hex
  const HSLToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  // Generate color schemes
  const generateColorSchemes = (primaryHex: string): ColorScheme[] => {
    const rgb = hexToRgb(primaryHex);
    if (!rgb) return [];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;

    const schemes: ColorScheme[] = [
      {
        name: "complementary",
        colors: [
          primaryHex,
          `#${hslToRgb((h + 180) % 360, s, l)
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 180) % 360, s, l)
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 180) % 360, s, l)
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb(h, s, Math.max(0, l - 20))
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb((h + 180) % 360, s, Math.max(0, l - 20))
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb(
            (h + 180) % 360,
            s,
            Math.max(0, l - 20)
          )
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb(
            (h + 180) % 360,
            s,
            Math.max(0, l - 20)
          )
            .b.toString(16)
            .padStart(2, "0")}`,
        ],
        description:
          "Complementary colors are opposite each other on the color wheel",
      },
      {
        name: "analogous",
        colors: [
          primaryHex,
          `#${hslToRgb((h + 30) % 360, s, l)
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 30) % 360, s, l)
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 30) % 360, s, l)
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb((h - 30 + 360) % 360, s, l)
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb((h - 30 + 360) % 360, s, l)
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb((h - 30 + 360) % 360, s, l)
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb(h, s, Math.max(0, l - 20))
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .b.toString(16)
            .padStart(2, "0")}`,
        ],
        description:
          "Analogous colors are next to each other on the color wheel",
      },
      {
        name: "triadic",
        colors: [
          primaryHex,
          `#${hslToRgb((h + 120) % 360, s, l)
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 120) % 360, s, l)
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 120) % 360, s, l)
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb((h + 240) % 360, s, l)
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 240) % 360, s, l)
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb((h + 240) % 360, s, l)
            .b.toString(16)
            .padStart(2, "0")}`,
          `#${hslToRgb(h, s, Math.max(0, l - 20))
            .r.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .g.toString(16)
            .padStart(2, "0")}${hslToRgb(h, s, Math.max(0, l - 20))
            .b.toString(16)
            .padStart(2, "0")}`,
        ],
        description: "Triadic colors are evenly spaced around the color wheel",
      },
    ];

    return schemes;
  };

  const colorSchemes = generateColorSchemes(primaryColor);
  const currentScheme = colorSchemes.find(
    (scheme) => scheme.name === selectedScheme
  );

  // Generate color variations
  const generateColorVariations = (hex: string) => {
    const hsl = hexToHSL(hex);
    const variations = [];

    // Generate lighter shades
    for (let i = 1; i <= 5; i++) {
      variations.push(
        HSLToHex(
          hsl.h,
          Math.max(0, Math.min(100, hsl.s - i * 5)),
          Math.min(100, hsl.l + i * 5)
        )
      );
    }

    // Add base color
    variations.push(hex);

    // Generate darker shades
    for (let i = 1; i <= 5; i++) {
      variations.push(
        HSLToHex(
          hsl.h,
          Math.min(100, hsl.s + i * 5),
          Math.max(0, hsl.l - i * 5)
        )
      );
    }

    return variations;
  };

  // Generate complementary colors
  const generateComplementaryColors = (hex: string) => {
    const hsl = hexToHSL(hex);
    return [hex, HSLToHex((hsl.h + 180) % 360, hsl.s, hsl.l)];
  };

  // Generate analogous colors
  const generateAnalogousColors = (hex: string) => {
    const hsl = hexToHSL(hex);
    return [
      HSLToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
      hex,
      HSLToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    ];
  };

  // Generate triadic colors
  const generateTriadicColors = (hex: string) => {
    const hsl = hexToHSL(hex);
    return [
      hex,
      HSLToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      HSLToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    ];
  };

  const variations = generateColorVariations(primaryColor);
  const complementary = generateComplementaryColors(primaryColor);
  const analogous = generateAnalogousColors(primaryColor);
  const triadic = generateTriadicColors(primaryColor);

  const ColorSwatch = ({
    color,
    size = "medium",
    label = "",
  }: {
    color: string;
    size?: "small" | "medium" | "large";
    label?: string;
  }) => (
    <div className="group relative">
      <div
        className={`
          rounded-md shadow-sm transition-transform duration-300 hover:scale-105 cursor-pointer
          ${
            size === "small"
              ? "w-8 h-8"
              : size === "medium"
              ? "w-12 h-12"
              : "w-16 h-16"
          }
        `}
        style={{ backgroundColor: color }}
        onClick={() => handleCopy(color, color)}
      />
      {label && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
      {copied === color && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
            Copied!
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
        <h3 className="text-xl font-semibold mb-4">Color Palette Generator</h3>

        {/* Color Scheme Selection */}
        <div className="flex gap-4 mb-6">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.name}
              onClick={() => setSelectedScheme(scheme.name)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedScheme === scheme.name
                  ? "bg-[#C60F7B] text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {scheme.name.charAt(0).toUpperCase() + scheme.name.slice(1)}
            </button>
          ))}
        </div>

        {/* Color Palette Display */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {currentScheme?.colors.map((color, index) => (
            <div key={index} className="space-y-2">
              <div
                className="w-full h-24 rounded-lg shadow-lg"
                style={{ backgroundColor: color }}
              />
              <code className="text-sm block text-center">{color}</code>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-sm">{currentScheme?.description}</p>
      </div>

      {/* Color Visualization */}
      <div className="bg-gray-800/30 p-6 rounded-xl border border-[#C60F7B]/20">
        <h3 className="text-xl font-semibold mb-4">Color Visualization</h3>

        {/* UI Elements Preview */}
        <div className="space-y-6">
          {/* Buttons */}
          <div className="space-y-2">
            <h4 className="font-medium">Buttons</h4>
            <div className="flex gap-4">
              {currentScheme?.colors.map((color, index) => (
                <button
                  key={index}
                  className="px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  Button {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            <h4 className="font-medium">Cards</h4>
            <div className="grid grid-cols-2 gap-4">
              {currentScheme?.colors.map((color, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg shadow-lg"
                  style={{ backgroundColor: color }}
                >
                  <h5 className="font-medium mb-2">Card {index + 1}</h5>
                  <p className="text-sm opacity-80">
                    This is a sample card with the selected color scheme.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h4 className="font-medium">Text</h4>
            <div className="space-y-2">
              {currentScheme?.colors.map((color, index) => (
                <p key={index} style={{ color }} className="text-lg">
                  Sample text in color {index + 1}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Color with Variations */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
          Color Scale
        </h5>
        <div className="flex items-center gap-1">
          {variations.map((color, index) => (
            <ColorSwatch
              key={index}
              color={color}
              size="medium"
              label={
                index === 5
                  ? "Base"
                  : index < 5
                  ? `Lighter ${5 - index}`
                  : `Darker ${index - 5}`
              }
            />
          ))}
        </div>
      </div>

      {/* Color Harmonies */}
      <div className="space-y-6">
        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
            Complementary
          </h5>
          <div className="flex items-center gap-2">
            {complementary.map((color, index) => (
              <ColorSwatch
                key={index}
                color={color}
                size="large"
                label={index === 0 ? "Primary" : "Complementary"}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
            Analogous
          </h5>
          <div className="flex items-center gap-2">
            {analogous.map((color, index) => (
              <ColorSwatch
                key={index}
                color={color}
                size="large"
                label={index === 1 ? "Primary" : index === 0 ? "-30°" : "+30°"}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
            Triadic
          </h5>
          <div className="flex items-center gap-2">
            {triadic.map((color, index) => (
              <ColorSwatch
                key={index}
                color={color}
                size="large"
                label={
                  index === 0 ? "Primary" : index === 1 ? "+120°" : "+240°"
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Color Applications */}
      <div className="space-y-3">
        <h5 className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
          Color Applications
        </h5>
        <div className="grid grid-cols-2 gap-3">
          {/* Text Combinations */}
          <div className="space-y-2 p-4 rounded-lg border border-gray-200">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              Text
            </div>
            <div style={{ color: primaryColor }} className="font-medium">
              Primary Text
            </div>
            <div style={{ color: variations[2] }} className="font-medium">
              Secondary Text
            </div>
            <div style={{ color: variations[3] }} className="font-medium">
              Tertiary Text
            </div>
          </div>

          {/* Background Combinations */}
          <div className="space-y-2 p-4 rounded-lg border border-gray-200">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              Backgrounds
            </div>
            <div className="space-y-1">
              <div
                style={{ backgroundColor: variations[0] }}
                className="h-6 rounded"
              />
              <div
                style={{ backgroundColor: variations[1] }}
                className="h-6 rounded"
              />
              <div
                style={{ backgroundColor: variations[2] }}
                className="h-6 rounded"
              />
            </div>
          </div>

          {/* Gradient Examples */}
          <div className="space-y-2 p-4 rounded-lg border border-gray-200">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              Gradients
            </div>
            <div className="space-y-1">
              <div
                className="h-8 rounded"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, ${complementary[1]})`,
                }}
              />
              <div
                className="h-8 rounded"
                style={{
                  background: `linear-gradient(to right, ${variations[1]}, ${variations[8]})`,
                }}
              />
            </div>
          </div>

          {/* Accent Colors */}
          <div className="space-y-2 p-4 rounded-lg border border-gray-200">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
              Accents
            </div>
            <div className="flex gap-1">
              <div
                style={{ backgroundColor: analogous[0] }}
                className="w-8 h-8 rounded"
              />
              <div
                style={{ backgroundColor: primaryColor }}
                className="w-8 h-8 rounded"
              />
              <div
                style={{ backgroundColor: analogous[2] }}
                className="w-8 h-8 rounded"
              />
              <div
                style={{ backgroundColor: complementary[1] }}
                className="w-8 h-8 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
