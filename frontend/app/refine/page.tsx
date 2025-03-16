"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { BrandResults } from "../components/BrandResults";

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

interface Question {
  id: number;
  title: string;
  component: (props: QuestionProps) => JSX.Element;
}

interface QuestionProps {
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function RefinePage() {
  const [currentStep, setCurrentStep] = useState(0);
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
  const [logos, setLogos] = useState<{
    anthropicLogo: string | null;
    mistralLogos: string[];
  }>({
    anthropicLogo: null,
    mistralLogos: [],
  });
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      title: "What is your company name?",
      component: ({ value, onChange, onNext }) => (
        <div className="space-y-6">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., Fudeno"
            className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 text-xl focus:outline-none focus:border-[#C60F7B] transition-all duration-300"
            required
          />
          <button
            onClick={onNext}
            disabled={!value}
            className="w-full py-6 bg-[#C60F7B] rounded-xl text-xl font-semibold text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
      ),
    },
    {
      id: 2,
      title: "What are you going to build?",
      component: ({ value, onChange, onNext, onBack }) => (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {["App", "SaaS", "NGO"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onChange(type);
                  onNext();
                }}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-xl font-medium ${
                  value === type
                    ? "border-[#C60F7B] bg-[#C60F7B] text-white"
                    : "border-gray-200 hover:border-[#C60F7B] hover:scale-[1.02] hover:shadow-lg"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button
            onClick={onBack}
            className="w-full py-6 border-2 border-gray-200 rounded-xl text-xl font-semibold hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Back
          </button>
        </div>
      ),
    },
    {
      id: 3,
      title: "Describe your company in one sentence",
      component: ({ value, onChange, onNext, onBack }) => (
        <div className="space-y-6">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., We create innovative solutions for sustainable urban mobility"
            className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 text-xl focus:outline-none focus:border-[#C60F7B] transition-all duration-300"
          />
          <button
            onClick={onNext}
            disabled={!value}
            className="w-full py-6 bg-[#C60F7B] rounded-xl text-xl font-semibold text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
          >
            Continue
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
          <button
            onClick={onBack}
            className="w-full py-6 border-2 border-gray-200 rounded-xl text-xl font-semibold hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Back
          </button>
        </div>
      ),
    },
    {
      id: 4,
      title: "What are your product values? (Select up to 5)",
      component: ({ value, onChange, onNext, onBack }) => {
        const allValues = [
          ...PRODUCT_VALUES,
          ...value.filter((v) => !PRODUCT_VALUES.includes(v)),
        ];

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allValues.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    if (value.includes(val)) {
                      onChange(value.filter((v) => v !== val));
                    } else if (value.length < 5) {
                      onChange([...value, val]);
                    }
                  }}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 text-lg font-medium group ${
                    value.includes(val)
                      ? "border-[#C60F7B] bg-[#C60F7B] text-white"
                      : "border-gray-200 hover:border-[#C60F7B] hover:scale-[1.02] hover:shadow-lg"
                  } ${!PRODUCT_VALUES.includes(val) ? "relative" : ""}`}
                  disabled={value.length >= 5 && !value.includes(val)}
                >
                  {val}
                  {!PRODUCT_VALUES.includes(val) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(value.filter((v) => v !== val));
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Add custom value"
                className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-6 text-xl focus:outline-none focus:border-[#C60F7B] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => {
                  if (
                    customValue &&
                    !allValues.includes(customValue) &&
                    value.length < 5
                  ) {
                    onChange([...value, customValue]);
                    setCustomValue("");
                  }
                }}
                disabled={
                  value.length >= 5 ||
                  !customValue ||
                  allValues.includes(customValue)
                }
                className="px-8 py-6 bg-[#C60F7B] rounded-xl text-xl font-semibold text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="text-lg text-gray-600 mt-2">
              Selected: {value.join(", ")}
            </div>
            <button
              onClick={onNext}
              disabled={value.length === 0}
              className="w-full py-6 bg-[#C60F7B] rounded-xl text-xl font-semibold text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
            >
              Continue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </button>
            <button
              onClick={onBack}
              className="w-full py-6 border-2 border-gray-200 rounded-xl text-xl font-semibold hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              Back
            </button>
          </div>
        );
      },
    },
    {
      id: 5,
      title: "Who are your customers?",
      component: ({ value, onChange, onBack }) => (
        <div className="space-y-6">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-48 bg-white border-2 border-gray-200 rounded-xl p-6 text-xl focus:outline-none focus:border-[#C60F7B] transition-all duration-300"
            placeholder="Describe your target customers..."
          />
          <button
            onClick={async () => {
              setIsLoading(true);
              const formData = {
                companyName,
                productType,
                companyProfile,
                productValues: selectedValues,
                customers: value,
              };

              try {
                console.log("Making request to /api/fonts with:", formData);
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
                console.log("Received font suggestions:", data);
                setFontSuggestions(data.fonts);
                setColors(data.colors);

                const logoData = {
                  ...formData,
                  selectedFont: data.fonts.option1,
                  selectedColor: data.colors.option1,
                };

                console.log("Making request to /api/logo with:", logoData);
                const logoResponse = await fetch("/api/logo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(logoData),
                });

                if (!logoResponse.ok) {
                  throw new Error("Failed to generate logo");
                }

                const logoResult = await logoResponse.json();
                console.log("Received logo response:", logoResult);
                setLogos({
                  anthropicLogo: logoResult.anthropicLogo,
                  mistralLogos: logoResult.mistralLogos,
                });
                setShowResults(true);
              } catch (error) {
                console.error("Error during generation:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!value || isLoading}
            className="w-full py-6 bg-[#C60F7B] rounded-xl text-xl font-semibold text-white hover:bg-[#A00C63] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                Generate Branding
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </>
            )}
          </button>
          <button
            onClick={onBack}
            className="w-full py-6 border-2 border-gray-200 rounded-xl text-xl font-semibold hover:border-[#C60F7B] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Back
          </button>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
      setLogos({
        anthropicLogo: logoData.anthropicLogo,
        mistralLogos: logoData.mistralLogos,
      });
      setShowResults(true);
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

  // Update handleRegenerate to be async
  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const formData = {
        companyName,
        productType,
        companyProfile,
        productValues: selectedValues,
        customers,
      };

      console.log("Regenerating with:", formData);

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

      // Generate new logo with first options
      console.log("Generating new logo with:", {
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
      setLogos({
        anthropicLogo: logoData.anthropicLogo,
        mistralLogos: logoData.mistralLogos,
      });
    } catch (error) {
      console.error("Error during regeneration:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentValue = () => {
    switch (currentStep) {
      case 0:
        return companyName;
      case 1:
        return productType;
      case 2:
        return companyProfile;
      case 3:
        return selectedValues;
      case 4:
        return customers;
      default:
        return "";
    }
  };

  const handleValueChange = (step: number) => (value: any) => {
    switch (step) {
      case 0:
        setCompanyName(value);
        break;
      case 1:
        setProductType(value);
        break;
      case 2:
        setCompanyProfile(value);
        break;
      case 3:
        setSelectedValues(value);
        break;
      case 4:
        setCustomers(value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Head>
        {fontLinks.map((link, index) => (
          <link key={index} rel="stylesheet" href={link} />
        ))}
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-white text-black">
        {/* Logo */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-12 py-6 flex items-center -space-x-1">
            <Image
              src="/logo.svg"
              alt="Fudeno Logo"
              width={160}
              height={50}
              className="hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="w-full mt-32 px-8">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-100 rounded-full mb-12">
            <div
              className="h-full bg-[#C60F7B] rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / questions.length) * 100}%`,
              }}
            />
          </div>

          {!showResults ? (
            <div className="space-y-8">
              <h2 className="text-4xl font-bold mb-8 transition-all duration-300 text-gray-900">
                {questions[currentStep].title}
              </h2>

              {questions[currentStep].component({
                value: getCurrentValue(),
                onChange: handleValueChange(currentStep),
                onNext: handleNext,
                onBack: handleBack,
              })}
            </div>
          ) : (
            <BrandResults
              companyName={companyName}
              fontSuggestions={fontSuggestions!}
              colors={colors!}
              logos={logos}
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>
    </>
  );
}
