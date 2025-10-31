import React, { useState } from 'react';
import Header from './Header';

const sampleImages = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/5.jpg',
];

interface LandingPageProps {
  onGoViral?: () => void;
  onSignIn?: () => void;
}

export default function LandingPage({ onGoViral, onSignIn }: LandingPageProps) {
  const [isAdVisible, setIsAdVisible] = useState(true);

  const handleCloseAd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdVisible(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Arial, sans-serif' }}>
      {isAdVisible && (
        <a href="https://pplx.ai/23b61a020423614" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="block w-full">
          <header className="flex flex-row items-center justify-center p-4 bg-white dark:bg-black border-b w-full">
            <div className="flex flex-row items-center justify-between w-full max-w-6xl px-4">
            <div className="flex flex-row items-center gap-2">
              {/* Logo */}
              <div className="flex items-center justify-center rounded-lg overflow-hidden w-8 h-8">
                <img 
                  src="/comet logo.jpg" 
                  alt="Comet logo" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col items-start justify-center gap-1">
                <p className="text-sm font-semibold text-black dark:text-white">
                  Comet - The browser that works for you
                </p>
              </div>
            </div>

            {/* Sponsored + Close */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">SPONSORED</span>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={handleCloseAd}
              >
                ✕
              </button>
            </div>
            </div>
          </header>
        </a>
      )}
      <div className="flex flex-col items-center w-full">
        <Header onSignIn={onSignIn || (() => {})} />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-16 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-black leading-tight mb-4" style={{ letterSpacing: '-0.01em' }}>
          Auto-insert <span className="text-[#0071e3] underline decoration-4 decoration-[#0071e3]">viral text</span> into your images
        </h1>
        <p className="mt-4 text-sm sm:text-base text-center text-[#6e6e73] max-w-2xl font-medium">
          Create POV-style YouTube thumbnails and social media posts that grab attention and blow up your feed.
        </p>
        <div className="flex gap-4 mt-8">
          <button
            className="bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors"
            onClick={onSignIn}
            type="button"
          >
            Try it now
          </button>
          <a
            href="https://youtu.be/aB65HsrbZos?si=zyH_WSxMc0bdVWRV"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-[#0071e3] text-[#0071e3] px-4 py-2 rounded-lg font-bold text-sm shadow transition-colors hover:bg-[#f0f8ff] flex items-center justify-center"
            style={{ textDecoration: 'none' }}
          >
            Watch Demo
          </a>
        </div>
      </section>
      {/* Gallery Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 px-4 w-full max-w-6xl">
        {sampleImages.map((img, idx) => (
          <div key={idx}>
            <img
              src={img}
              alt={`Sample ${idx + 1}`}
              className="rounded-xl object-contain w-full h-64"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
} 
