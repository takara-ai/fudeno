"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const words = ["App", "SaaS", "NGO"];

const testimonials = [
  {
    quote:
      "The AI-generated brand assets exceeded our expectations. Saved us weeks of design iterations.",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    image: "/placeholder-avatar.png",
  },
  {
    quote:
      "Our brand identity feels so cohesive and professional. Best investment for our startup.",
    author: "Michael Rodriguez",
    role: "CEO, InnovateLab",
    image: "/placeholder-avatar.png",
  },
  {
    quote:
      "The generated templates made our pitch deck stand out. Highly recommended!",
    author: "Emma Thompson",
    role: "Marketing Director, GrowthX",
    image: "/placeholder-avatar.png",
  },
];

const companies = [
  { name: "TechFlow", logo: "/placeholder-logo.png" },
  { name: "InnovateLab", logo: "/placeholder-logo.png" },
  { name: "GrowthX", logo: "/placeholder-logo.png" },
  { name: "FutureScale", logo: "/placeholder-logo.png" },
  { name: "QuantumLeap", logo: "/placeholder-logo.png" },
];

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-gray-900 via-[#2A0A1F] to-black text-white">
      {/* Hero Section */}
      <div className="flex min-h-[70vh] items-center justify-center w-full">
        <div className="max-w-4xl w-full text-center p-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Style my{" "}
            <span className="inline-block min-w-[120px] text-[#C60F7B] transition-all duration-500 animate-pulse">
              {words[currentWord]}
            </span>
          </h1>

          <button
            onClick={() => router.push("/refine")}
            className="mt-8 px-8 py-4 bg-[#C60F7B] hover:bg-[#A00C63] text-white rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(198,15,123,0.3)]"
          >
            Create your brand
          </button>
        </div>
      </div>

      {/* Companies Section */}
      <section className="w-full py-16 px-4 border-t border-[#C60F7B]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl text-center text-[#C60F7B]/80 mb-12 font-semibold">
            Trusted by innovative companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-800/50 rounded-lg flex items-center justify-center border border-[#C60F7B]/20 hover:border-[#C60F7B]/40 transition-all duration-300">
                  <span className="text-sm text-gray-400">{company.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 px-4 border-t border-[#C60F7B]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What our users say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/30 p-8 rounded-2xl backdrop-blur-sm hover:transform hover:scale-105 transition-all duration-300 border border-[#C60F7B]/10 hover:border-[#C60F7B]/30 hover:shadow-[0_0_30px_rgba(198,15,123,0.1)]"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#C60F7B]/20 rounded-full mr-4 border border-[#C60F7B]/20"></div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {testimonial.author}
                    </h3>
                    <p className="text-[#C60F7B]/70 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
