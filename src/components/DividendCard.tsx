"use client";
import Card from './Card';
import { ReactNode } from 'react';
import React, { memo } from 'react';

interface DividendCardProps {
  title: string;
  value: string | number;
  meta?: ReactNode; // Optional meta info (e.g., green text)
}

const DividendCard = ({ title, value, meta }: DividendCardProps) => {
  return (
    <Card className="bg-white dark:bg-[#23272F] dark:border dark:border-[#2D3748] transition-colors duration-300">
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-blue-100 mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-gray-900 dark:text-blue-100">{value}</span>
          {meta && <span>{meta}</span>}
        </div>
      </div>
    </Card>
  );
};

export default memo(DividendCard); 