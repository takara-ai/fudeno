"use client";

import Image from "next/image";
import { useState } from "react";

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

export default function RefinePage() {
  const [productType, setProductType] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");
  const [customers, setCustomers] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      productType,
      companyProfile,
      productValues: selectedValues,
      customers,
    };
    console.log(formData);
  };

  return (
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
            className="w-full py-4 bg-[#C60F7B] rounded-lg text-xl font-semibold hover:bg-[#A00C63] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(198,15,123,0.3)]"
          >
            Generate Brand Assets
          </button>
        </form>
      </div>
    </main>
  );
}
