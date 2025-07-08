import React, { useEffect, useRef } from 'react';

interface LandingPageProps {
  onGoViral?: () => void;
  onSignIn?: () => void;
}

const sampleImages = [
  '/landingpage/1.png',
  '/landingpage/2.png',
  '/landingpage/3.png',
  '/landingpage/4.png',
  '/landingpage/5.png',
  '/landingpage/6.png',
  '/landingpage/7.png',
  '/landingpage/8.png',
  '/landingpage/9.png',
];

// Swap 2nd row 2nd/3rd images with 3rd row 2nd/3rd images
const reorderedImages = [...sampleImages];
[reorderedImages[4], reorderedImages[7]] = [reorderedImages[7], reorderedImages[4]];
[reorderedImages[5], reorderedImages[8]] = [reorderedImages[8], reorderedImages[5]];
// Move 2nd row, 2nd image to 1st place of 2nd row
const reorderedImages2 = [...reorderedImages];
const imgToMove = reorderedImages2.splice(4, 1)[0];
reorderedImages2.splice(3, 0, imgToMove);

export default function LandingPage({ onGoViral, onSignIn }: LandingPageProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Auto-scroll animation
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    let frame: number;
    let scrollAmount = 0;
    const speed = 1; // px per frame
    function animate() {
      if (!slider) return;
      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
        slider.scrollLeft = 0;
        scrollAmount = 0;
      } else {
        slider.scrollLeft += speed;
        scrollAmount += speed;
      }
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-2 sm:px-4" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Arial, sans-serif' }}>
      {/* Hero Section - No card effect */}
      <div className="w-full max-w-4xl mb-8 flex flex-col items-center px-2 sm:px-6">
        {/* Headline - Responsive font and spacing, two lines on mobile */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-semibold text-center text-gray-900 leading-tight mb-8 sm:mb-12 mt-10 sm:mt-20 flex flex-col items-center justify-center gap-2" style={{ letterSpacing: '-0.01em', fontFamily: '-apple-system, BlinkMacSystemFont, \"San Francisco\", \"Segoe UI\", Roboto, Arial, sans-serif' }}>
          <span>
            <span>Create </span>
            <span className="bg-black text-white px-4 py-1 sm:px-6 sm:py-2 rounded-lg mx-1 sm:mx-2 inline-block" style={{ fontWeight: 600, fontSize: '1em', lineHeight: 1 }}>
              text-behind-object
            </span>
          </span>
          <span>designs easily</span>
        </h1>
        {/* Subheadline - Responsive font */}
        <p className="text-center text-base sm:text-xl text-gray-900 mb-6 sm:mb-8 max-w-2xl mx-auto font-semibold">
          1,000+ text behind object designs created
        </p>
        {/* CTA Button - Responsive */}
        <div className="flex justify-center w-full">
          <button
            className="bg-white border border-gray-300 rounded-full px-6 py-2 sm:px-8 sm:py-3 font-semibold text-base sm:text-lg shadow hover:bg-gray-100 transition text-gray-900"
            onClick={onGoViral}
          >
            Open the app
          </button>
        </div>
      </div>
      {/* Images Grid - Responsive columns and spacing */}
      <div className="w-full max-w-5xl mb-8 px-1 sm:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {reorderedImages2.map((img, idx) => (
            <div key={idx} className="flex items-center justify-center">
              <img
                src={img}
                alt={`Sample ${idx + 1}`}
                className="object-contain max-w-full max-h-60 sm:max-h-80 mb-0 transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ display: 'block' }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Footer - Responsive font and spacing */}
      <div className="w-full flex flex-col items-center mt-6 mb-4 px-2">
        <p className="text-center text-sm sm:text-base text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, \"San Francisco\", \"Segoe UI\", Roboto, Arial, sans-serif' }}>
          2025 <a href="https://twitter.com/Praveenthotakur" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">@Praveenthotakur</a> - All Rights Reserved - Created by Praveenthotakuri
        </p>
      </div>
      {/* Subtle BG Illustration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute left-0 top-0 opacity-10" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="650" cy="100" r="120" fill="url(#paint0_radial)" />
          <circle cx="200" cy="500" r="180" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientTransform="rotate(90 275 375) scale(120)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#a5b4fc" />
              <stop offset="1" stopColor="#f9fafb" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="rotate(90 350 150) scale(180)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f472b6" />
              <stop offset="1" stopColor="#f9fafb" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
} 
