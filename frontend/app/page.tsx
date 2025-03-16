"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const words = ["startup", "organization", "company", "application"];

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
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      {/* Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Image
            src="/logo.svg"
            alt="Fudeno Logo"
            width={160}
            height={50}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex min-h-[70vh] items-center justify-between w-full max-w-7xl mx-auto px-4 pt-32">
        {/* Left side content */}
        <div className="w-1/2 text-left">
          <h1 className="text-6xl md:text-[5.5rem] font-bold mb-8 tracking-tight">
            Create a brand for your
            <br />
            <span className="inline-block min-w-[400px] text-indigo-600 transition-all duration-500">
              {words[currentWord]}
            </span>
          </h1>
          <p className="text-gray-600 text-xl md:text-2xl mt-6 mb-12">
            Get a complete brand kit with logos, colors, and templates.
            <br />
            Ready-to-use files for web, print, and social media.
          </p>

          <div className="flex">
            <button
              onClick={() => router.push("/refine")}
              className="px-12 py-6 bg-[#C60F7B] text-white rounded-xl text-xl font-semibold transition-all duration-300 hover:bg-[#A00C63] hover:scale-105 hover:shadow-xl shadow-md flex items-center gap-3"
            >
              Create your brand
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
        </div>

        {/* Right side - Brand Examples */}
        <div className="w-1/2 pl-8">
          <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/imageland.png"
              alt="Brand Examples"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
