'use client';

import React from 'react';

interface AlertsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  isOpen,
  onClose,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Alert Center</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Alerts system temporarily disabled during build optimization.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">
            Full alerts functionality will be restored after build fixes are complete.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
