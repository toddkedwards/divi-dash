'use client';

import React, { useState } from 'react';
import { Shield, Smartphone, Copy, Check, AlertTriangle } from 'lucide-react';

interface TwoFactorAuthProps {
  isEnabled: boolean;
  onEnable: (secret: string, token: string) => Promise<boolean>;
  onDisable: (token: string) => Promise<boolean>;
}

export default function TwoFactorAuth({ isEnabled, onEnable, onDisable }: TwoFactorAuthProps) {
  const [step, setStep] = useState<'setup' | 'verify' | 'enabled'>('setup');
  const [secret] = useState('JBSWY3DPEHPK3PXP'); // Generate this properly in production
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnable = async () => {
    if (verificationCode.length !== 6) return;
    setLoading(true);
    try {
      await onEnable(secret, verificationCode);
      setStep('enabled');
    } catch (err) {
      setError('Invalid code');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {!isEnabled ? (
        <div className="space-y-4">
          <p className="text-gray-600">Add an extra layer of security to your account</p>
          
          {step === 'setup' && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Setup Instructions:</p>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Install an authenticator app (Google Authenticator, Authy)</li>
                  <li>2. Add this key: <code className="bg-white px-2 py-1 rounded">{secret}</code></li>
                  <li>3. Enter the 6-digit code below</li>
                </ol>
              </div>
              
              <input
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border rounded-lg text-center font-mono"
                maxLength={6}
              />
              
              <button
                onClick={handleEnable}
                disabled={loading || verificationCode.length !== 6}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Enabling...' : 'Enable 2FA'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-green-800">Two-factor authentication is enabled</span>
          </div>
          
          <button
            onClick={() => setStep('setup')}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
} 