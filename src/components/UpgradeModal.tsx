import React from 'react';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full p-8 relative flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Full access + 200+ fonts</h2>
        <p className="text-gray-700 text-center mb-4 text-base font-medium">
          Create stunning text-behind-object designs effortlessly.<br />
          <span className="font-semibold text-[#0071e3]">Lifetime access</span>
        </p>
        <ul className="mb-6 text-gray-600 text-sm list-disc list-inside text-left w-full max-w-xs mx-auto">
          <li>All features unlocked</li>
          <li>200+ premium fonts</li>
          <li>One-time payment, no subscription</li>
        </ul>
        <button
          className="bg-[#0071e3] hover:bg-[#005bb5] text-white font-bold py-3 px-8 rounded-lg text-lg shadow w-full transition"
          onClick={() => window.location.href = 'https://checkout.dodopayments.com/buy/pdt_jMRYvgBEhriwGIpeecAM1?quantity=1&redirect_url=https://textbehindobject.xyz%2Feditor'}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
} 