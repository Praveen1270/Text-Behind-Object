import React, { useState } from 'react';
import { Button } from './ui/button';
import UpgradeModal from './UpgradeModal';

export default function UpgradeButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="w-full md:w-auto"
      >
        Upgrade
      </Button>
      <UpgradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
} 