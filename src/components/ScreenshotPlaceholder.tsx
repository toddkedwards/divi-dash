import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ScreenshotPlaceholderProps {
  label?: string;
  height?: number | string;
  width?: number | string;
  className?: string;
}

const ScreenshotPlaceholder: React.FC<ScreenshotPlaceholderProps> = ({
  label = 'Screenshot Coming Soon',
  height = 320,
  width = '100%',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl shadow-md bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 transition-colors ${className}`}
      style={{ height, width, minHeight: 180 }}
    >
      <ImageIcon size={48} className="mb-2" />
      <span className="font-medium text-base opacity-80">{label}</span>
    </div>
  );
};

export default ScreenshotPlaceholder; 