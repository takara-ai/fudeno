"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";

const PRODUCT_VALUES = [
  "Curiosity",
  "Quality",
  "Innovation",
  "Trust",
  "Sustainability",
  "Reliability",
  "Creativity",
  "Efficiency",
  "Transparency",
  "Excellence",
];

// Example text to showcase fonts
const FONT_SHOWCASE_TEXT = "The quick brown fox jumps over the lazy dog";

export default function RefinePage() {
  const [companyName, setCompanyName] = useState("");
  const [productType, setProductType] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");
  const [customers, setCustomers] = useState("");
  const [fontSuggestions, setFontSuggestions] = useState<{
    option1: string;
    option2: string;
    option3: string;
  } | null>(null);
  const [colors, setColors] = useState<{
    option1: string;
    option2: string;
    option3: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontLinks, setFontLinks] = useState<string[]>([]);
  const [logo, setLogo] = useState<string | null>(null);

  const handleValueSelection = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else if (selectedValues.length < 5) {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleAddCustomValue = () => {
    if (
      customValue &&
      !PRODUCT_VALUES.includes(customValue) &&
      selectedValues.length < 5
    ) {
      setSelectedValues([...selectedValues, customValue]);
      setCustomValue("");
    }
  };

  const extractFontFamilies = (cssText: string) => {
    const fontFamilyRegex = /font-family:\s*'([^']+)'/g;
    const fonts: string[] = [];
    let match;

    while ((match = fontFamilyRegex.exec(cssText)) !== null) {
      fonts.push(match[1]);
    }

    return fonts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      companyName,
      productType,
      companyProfile,
      productValues: selectedValues,
      customers,
    };

    console.log("Form Input:", formData);

    try {
      const response = await fetch("/api/fonts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch font suggestions");
      }

      const data = await response.json();
      console.log("API Response:", data);

      setFontSuggestions(data.fonts);
      setColors(data.colors);

      // Automatically generate logo with first options
      console.log("Generating logo with:", {
        companyName,
        productType,
        companyProfile,
        productValues: selectedValues,
        customers,
        selectedFont: data.fonts.option1,
        selectedColor: data.colors.option1,
      });

      const logoResponse = await fetch("/api/logo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          productType,
          companyProfile,
          productValues: selectedValues,
          customers,
          selectedFont: data.fonts.option1,
          selectedColor: data.colors.option1,
        }),
      });

      if (!logoResponse.ok) {
        throw new Error("Failed to generate logo");
      }

      const logoData = await logoResponse.json();
      console.log("Logo API Response:", logoData);
      setLogo(logoData.logo);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to generate Google Fonts link
  const generateGoogleFontsLink = (fonts: string[]) => {
    const formattedFonts = fonts
      .map((font) => font.replace(/\s+/g, "+"))
      .join("|");
    return `https://fonts.googleapis.com/css2?family=${formattedFonts}&display=swap`;
  };

  // Update font links when suggestions change
  useEffect(() => {
    if (fontSuggestions && Object.values(fontSuggestions).length > 0) {
      setFontLinks([generateGoogleFontsLink(Object.values(fontSuggestions))]);

      // Dynamically add font stylesheet
      Object.values(fontSuggestions).forEach((font) => {
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(
          /\s+/g,
          "+"
        )}&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      });
    }
  }, [fontSuggestions]);

  return (
    <>
      <Head>
        {fontLinks.map((link, index) => (
          <link key={index} rel="stylesheet" href={link} />
        ))}
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 via-[#2A0A1F] to-black text-white">
        {/* Logo */}
        <div className="fixed top-6 left-12 z-50">
          <Image
            src="/logo.svg"
            alt="Fudeno Logo"
            width={160}
            height={50}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="max-w-4xl w-full mt-32 p-8">
          <h1 className="text-4xl font-bold mb-12">Refine Your Brand</h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Company Name Question */}
            <div className="space-y-4">
              <label className="text-2xl font-semibold block">
                What is your company name?
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Fudeno"
                className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4 focus:outline-none focus:border-[#C60F7B]"
                required
              />
            </div>

            {/* Product Type Question */}
            <div className="space-y-4">
              <label className="text-2xl font-semibold block">
                What are you going to build?
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["App", "SaaS", "NGO"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setProductType(type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      productType === type
                        ? "border-[#C60F7B] bg-[#C60F7B]/20"
                        : "border-gray-700 hover:border-[#C60F7B]/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Company Profile Question */}
            <div className="space-y-4">
              <label className="text-2xl font-semibold block">
                Describe your company in one sentence
              </label>
              <input
                type="text"
                value={companyProfile}
                onChange={(e) => setCompanyProfile(e.target.value)}
                placeholder="e.g., We create innovative solutions for sustainable urban mobility"
                className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4 focus:outline-none focus:border-[#C60F7B]"
              />
            </div>

            {/* Product Values Question */}
            <div className="space-y-4">
              <label className="text-2xl font-semibold block">
                What are your product values? (Select up to 5)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRODUCT_VALUES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleValueSelection(value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedValues.includes(value)
                        ? "border-[#C60F7B] bg-[#C60F7B]/20"
                        : "border-gray-700 hover:border-[#C60F7B]/50"
                    }`}
                    disabled={
                      selectedValues.length >= 5 &&
                      !selectedValues.includes(value)
                    }
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="Add custom value"
                  className="flex-1 bg-gray-800/50 border-2 border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#C60F7B]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomValue}
                  disabled={selectedValues.length >= 5 || !customValue}
                  className="px-6 py-3 bg-[#C60F7B] rounded-lg hover:bg-[#A00C63] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Add
                </button>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                Selected: {selectedValues.join(", ")}
              </div>
            </div>

            {/* Customers Question */}
            <div className="space-y-4">
              <label className="text-2xl font-semibold block">
                Who are your customers?
              </label>
              <textarea
                value={customers}
                onChange={(e) => setCustomers(e.target.value)}
                className="w-full h-32 bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4 focus:outline-none focus:border-[#C60F7B]"
                placeholder="Describe your target customers..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#C60F7B] rounded-lg text-xl font-semibold hover:bg-[#A00C63] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(198,15,123,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Generating Suggestions..."
                : "Generate Brand Assets"}
            </button>
          </form>

          {/* Brand Assets */}
          {fontSuggestions && colors && logo && (
            <div className="mt-12 space-y-8">
              <h2 className="text-3xl font-bold text-[#C60F7B]">
                Your Brand Assets
              </h2>

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
                    <h3 className="text-xl font-semibold mb-4">
                      Color Options
                    </h3>
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
          )}
        </div>
      </main>
    </>
  );
}
