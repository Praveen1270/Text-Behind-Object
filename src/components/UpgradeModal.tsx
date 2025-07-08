import React from 'react';
import PricingCard from './PricingCard';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  hideClose?: boolean;
}

export default function UpgradeModal({ open, onClose, hideClose = false }: UpgradeModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative">
        {!hideClose && (
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
        <PricingCard showSignInButton={false} showBuyButton={false} />
      </div>
    </div>
  );
} 