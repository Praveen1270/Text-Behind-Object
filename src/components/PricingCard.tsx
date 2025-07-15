import React from 'react';
import { Button } from './ui/button';

interface PricingCardProps {
  onSignIn?: () => void;
  showSignInButton?: boolean;
  requireSignIn?: boolean;
  showBuyButton?: boolean;
}

export default function PricingCard({ onSignIn, showSignInButton = true, requireSignIn = false, showBuyButton = true }: PricingCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-8 flex flex-col items-center mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Creator Plan</h2>
      <div className="text-center mb-4">
        <span className="text-2xl font-bold text-[#0071e3]">$5</span>
        <span className="text-base text-gray-700 font-medium ml-2">/ One Time</span>
      </div>
      <ul className="mb-6 text-gray-700 text-base list-none text-left w-full max-w-xs mx-auto space-y-2">
        <li>Unlimited Designs</li>
        <li>Lifetime Access</li>
        <li>All Text-Behind-Object Features</li>
        <li>Future Updates Included</li>
        <li>
          <a href="https://twitter.com/Praveenthotakur" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.698a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.014-4.49 4.495 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.6 1.67 4.98a4.48 4.48 0 0 0-.61 2.262c0 1.56.793 2.936 2.003 3.744a4.48 4.48 0 0 1-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.417-.377.104-.775.16-1.186.16-.29 0-.568-.028-.84-.08.57 1.77 2.22 3.06 4.18 3.09A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.017c8.26 0 12.78-6.84 12.78-12.77 0-.195-.004-.39-.013-.583A9.1 9.1 0 0 0 24 4.59a8.98 8.98 0 0 1-2.54.697z"/></svg>
            @Praveenthotakur
          </a>
        </li>
      </ul>
      {showSignInButton && (
        <Button className="w-full mb-2" onClick={onSignIn}>
          Sign In
        </Button>
      )}
      {showBuyButton && (
        <Button
          className="w-full bg-[#0071e3] hover:bg-[#005bb5] text-white font-bold py-3 px-8 rounded-lg text-lg shadow transition"
          onClick={() => window.location.href = 'https://checkout.dodopayments.com/buy/pdt_jMRYvgBEhriwGIpeecAM1?quantity=1&redirect_url=https://textbehindobject.xyz%2Feditor'}
          disabled={requireSignIn}
        >
          Buy Now
        </Button>
      )}
      {requireSignIn && (
        <div className="text-xs text-gray-500 text-center mt-2">Please sign in to purchase the Creator Plan.</div>
      )}
    </div>
  );
} 
