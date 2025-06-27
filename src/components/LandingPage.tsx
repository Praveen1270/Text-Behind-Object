import React, { useEffect, useRef } from 'react';

interface LandingPageProps {
  onGoViral?: () => void;
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
];

export default function LandingPage({ onGoViral }: LandingPageProps) {
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center px-2" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, Arial, sans-serif' }}>
      {/* Sticky Nav */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-4xl rounded-full bg-white/80 backdrop-blur border border-gray-200 shadow flex items-center justify-between px-6 py-2 mb-4">
        <span className="font-semibold text-base tracking-tight text-gray-900 px-2">Text Behind Object</span>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-gray-700 font-medium text-sm hover:text-[#0071e3] transition px-2">Pricing</a>
          <button className="border border-gray-300 rounded-full px-4 py-1 font-medium text-gray-700 text-sm hover:bg-gray-900 hover:text-white transition">Sign in</button>
        </div>
      </nav>
      {/* Hero Card */}
      <div className="w-full max-w-4xl mt-32 mb-8 rounded-3xl bg-white border border-gray-200 shadow-xl p-6 md:p-10 flex flex-col items-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 leading-tight mb-8" style={{ letterSpacing: '-0.01em' }}>
          Create viral content<br />
          by adding <span className="font-playfair-display underline decoration-4 decoration-[#0071e3] underline-offset-8">text behind</span> your images.
        </h1>
        {/* Subheadline */}
        <p className="text-center text-sm text-gray-600 mb-6 max-w-2xl mx-auto font-normal">
          Instantly make beautiful YouTube thumbnails and social posts. No design skills needed—just upload, customize, and go viral.
        </p>
        {/* Features Row */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 w-full text-xs text-gray-700">
          <div className="flex flex-col items-center">
            <span className="font-medium">1000+ Images</span>
            <span className="text-[10px] text-gray-400 mt-1">Unlimited creative options</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">Full Customization</span>
            <span className="text-[10px] text-gray-400 mt-1">Fonts, colors, effects & more</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium">New Features</span>
            <span className="text-[10px] text-gray-400 mt-1">Early access & updates</span>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-2 mt-1 w-full">
          <button
            className="bg-[#0071e3] text-white rounded-lg px-6 py-2 font-semibold text-base shadow hover:bg-[#005bb5] transition w-full md:w-auto"
            onClick={onGoViral}
          >
            Go Viral Today
          </button>
          <button className="bg-white border border-gray-300 rounded-lg px-6 py-2 font-semibold text-base shadow hover:bg-gray-100 transition w-full md:w-auto">
            Watch Demo
          </button>
        </div>
      </div>
      {/* Sample Images Gallery - Auto-scrolling slider */}
      <div className="w-full max-w-5xl">
        <div ref={sliderRef} className="flex flex-row gap-6 overflow-x-auto pb-1 scroll-snap-x snap-mandatory hide-scrollbar">
          {sampleImages.map((img, idx) => (
            <div key={idx} className="flex items-center justify-center min-w-[300px] max-w-[400px] snap-start">
              <img
                src={img}
                alt={`Sample ${idx + 1}`}
                className="object-contain w-full max-h-80 mb-4 transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ display: 'block' }}
              />
            </div>
          ))}
        </div>
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