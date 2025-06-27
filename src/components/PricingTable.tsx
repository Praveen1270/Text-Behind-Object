import React from 'react';

const PricingTable: React.FC = () => {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 text-center" style={{ letterSpacing: '-0.01em' }}>
        Text Behind Image
      </h2>
      <p className="text-center text-sm text-gray-600 mb-6 max-w-xs mx-auto font-normal">
        Full access + 200+ fonts. Create stunning text-behind-object designs effortlessly.
      </p>
      <div className="flex justify-center items-end mb-6">
        <span className="text-5xl font-extrabold text-gray-900 leading-none">$2.00</span>
        <span className="ml-2 text-gray-500 text-base mb-1">/ one-time</span>
      </div>
      <ul className="mb-8 space-y-2 w-full">
        <li className="flex items-center text-gray-700 text-base">
          <span className="mr-2 text-[#0071e3] text-lg">✔</span> Full access
        </li>
        <li className="flex items-center text-gray-700 text-base">
          <span className="mr-2 text-[#0071e3] text-lg">✔</span> 200+ fonts
        </li>
        <li className="flex items-center text-gray-700 text-base">
          <span className="mr-2 text-[#0071e3] text-lg">✔</span> Stunning text-behind-object designs
        </li>
      </ul>
      <button className="w-full bg-[#0071e3] hover:bg-[#005bb5] text-white font-semibold py-3 px-4 rounded-lg shadow transition duration-200 text-lg">
        Get Started
      </button>
    </div>
  );
};

export default PricingTable; 