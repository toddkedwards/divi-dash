import React, { memo } from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 ${className}`}>
      {children}
    </div>
  );
};

export default memo(Card); 