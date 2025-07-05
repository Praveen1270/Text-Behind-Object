import React from 'react';
import { Button } from './ui/button';

export default function UpgradeButton() {
  return (
    <Button
      onClick={() =>
        window.location.href =
          'https://checkout.dodopayments.com/buy/pdt_jMRYvgBEhriwGIpeecAM1?quantity=1'
      }
      className="w-full"
    >
      Upgrade to Unlock
    </Button>
  );
} 