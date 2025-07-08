import React, { useState } from 'react';
import { Button } from './ui/button';
import PricingCard from './PricingCard';

interface HeaderProps {
  onSignIn: () => void;
}

export default function Header({ onSignIn }: HeaderProps) {
  const [showPricing, setShowPricing] = useState(false);
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      {/* Brand */}
      <div className="flex items-center">
        <span className="font-bold tracking-tight text-sm sm:text-base md:text-lg" style={{ color: '#0071e3', fontFamily: '-apple-system, BlinkMacSystemFont, \"San Francisco\", \"Segoe UI\", Roboto, Arial, sans-serif' }}>
          text-behind-object
        </span>
      </div>
      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="font-semibold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
          onClick={() => setShowPricing(true)}
        >
          Pricing
        </button>
        <a
          href="https://twitter.com/Praveenthotakur"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
          aria-label="Twitter"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="inline-block align-middle text-black"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.014-4.49 4.495 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.6 1.67 4.98a4.48 4.48 0 0 0-.61 2.262c0 1.56.793 2.936 2.003 3.744a4.48 4.48 0 0 1-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.104-.775.16-1.186.16-.29 0-.568-.028-.84-.08.57 1.77 2.22 3.06 4.18 3.09A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.195-.004-.39-.013-.583A9.1 9.1 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
        </a>
        <Button onClick={onSignIn} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold text-xs sm:text-sm">
          Sign In
        </Button>
      </div>
      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setShowPricing(false)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => setShowPricing(false)}
              aria-label="Close"
            >
              ×
            </button>
            <PricingCard showSignInButton={false} showBuyButton={false} />
          </div>
        </div>
      )}
    </header>
  );
} 