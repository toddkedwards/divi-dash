import React, { memo } from 'react';
import { Lock } from 'lucide-react';

const ProBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wide">
      <Lock size={12} className="inline-block" /> PRO
    </span>
  );
};

export default memo(ProBadge); 