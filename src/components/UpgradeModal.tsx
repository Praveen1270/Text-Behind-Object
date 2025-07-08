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
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Creator Plan</h2>
        <div className="text-center mb-4">
          <span className="text-2xl font-bold text-[#0071e3]">$1.5</span>
          <span className="text-base text-gray-700 font-medium ml-2">/ One Time</span>
        </div>
        <ul className="mb-6 text-gray-700 text-base list-none text-left w-full max-w-xs mx-auto space-y-2">
          <li>✅ Unlimited Designs</li>
          <li>✅ Lifetime Access</li>
          <li>✅ All Text-Behind-Object Features</li>
          <li>✅ Future Updates Included</li>
          <li>✅ <a href="https://twitter.com/Praveenthotakur" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">Chat with Creator (Click to DM)</a></li>
        </ul>
        <button
          className="bg-[#0071e3] hover:bg-[#005bb5] text-white font-bold py-3 px-8 rounded-lg text-lg shadow w-full transition mb-4"
          onClick={() => window.location.href = 'https://checkout.dodopayments.com/buy/pdt_jMRYvgBEhriwGIpeecAM1?quantity=1&redirect_url=https://textbehindobject.xyz%2Feditor'}
        >
          Buy Now
        </button>
        <div className="text-xs text-gray-500 text-center mt-2">
          I'm just 1 person building this. Your support helps keep it alive.<br />
          Server costs, updates, and your feedback all matter.<br />
          <span className="font-semibold text-gray-700">Please purchase to continue using the tool.</span><br />
          <span className="block mt-2">Use the same email you signed in with to TextBehindObject when visiting the payment portal.</span>
        </div>
      </div>
    </div>
  );
} 