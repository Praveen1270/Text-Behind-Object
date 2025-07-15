import React from 'react';
import Header from './Header';

const sampleImages = [
  '/landingpage/1.jpg',
  '/landingpage/2.jpg',
  '/landingpage/3.jpg',
  '/landingpage/4.jpg',
  '/landingpage/5.jpg',
];

interface LandingPageProps {
  onGoViral?: () => void;
  onSignIn?: () => void;
}

export default function LandingPage({ onGoViral, onSignIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Arial, sans-serif' }}>
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
  );
} 
