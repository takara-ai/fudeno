"use client";

import Image from "next/image";

export default function ResultPage() {
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
        <h1 className="text-4xl font-bold mb-8">Your Brand Assets</h1>
        <div className="w-full">
          <p className="text-xl text-gray-300">
            Coming soon: Your generated brand assets
          </p>
        </div>
      </div>
    </main>
  );
}
