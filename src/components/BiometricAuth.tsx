'use client';

import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';

interface BiometricAuthProps {
  onAuthSuccess?: (method: string) => void;
  onAuthError?: (error: string) => void;
  className?: string;
}

interface BiometricCapabilities {
  isSupported: boolean;
  hasFingerprint: boolean;
  hasFaceID: boolean;
  hasDeviceCredential: boolean;
  methods: string[];
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onAuthSuccess,
  onAuthError,
  className = ''
}) => {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    isSupported: false,
    hasFingerprint: false,
    hasFaceID: false,
    hasDeviceCredential: false,
    methods: []
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [lastAuthMethod, setLastAuthMethod] = useState<string>('');

  useEffect(() => {
    checkBiometricCapabilities();
    loadBiometricSettings();
  }, []);

  const checkBiometricCapabilities = async () => {
    try {
      // Check if WebAuthn is supported
      const isWebAuthnSupported = window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      // Check for specific biometric methods
      const methods: string[] = [];
      let hasFingerprint = false;
      let hasFaceID = false;
      let hasDeviceCredential = false;

      if (isWebAuthnSupported) {
        // Detect platform capabilities
        if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
          hasFaceID = true;
          methods.push('Face ID');
        }
        
        if (navigator.userAgent.includes('Android')) {
          hasFingerprint = true;
          methods.push('Fingerprint');
        }

        if (navigator.userAgent.includes('Windows')) {
          hasFingerprint = true;
          methods.push('Windows Hello');
        }

        if (navigator.userAgent.includes('Mac')) {
          hasFingerprint = true;
          methods.push('Touch ID');
        }

        hasDeviceCredential = true;
      }

      setCapabilities({
        isSupported: isWebAuthnSupported,
        hasFingerprint,
        hasFaceID,
        hasDeviceCredential,
        methods
      });
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      setCapabilities({
        isSupported: false,
        hasFingerprint: false,
        hasFaceID: false,
        hasDeviceCredential: false,
        methods: []
      });
    }
  };

  const loadBiometricSettings = () => {
    const saved = localStorage.getItem('biometric_auth_enabled');
    setIsEnabled(saved === 'true');
  };

  const saveBiometricSettings = (enabled: boolean) => {
    localStorage.setItem('biometric_auth_enabled', enabled.toString());
    setIsEnabled(enabled);
  };

  const setupBiometricAuth = async () => {
    if (!capabilities.isSupported) {
      onAuthError?.('Biometric authentication is not supported on this device');
      return;
    }

    setIsAuthenticating(true);
    
    try {
      // Create credential for biometric authentication
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32), // Should be random in production
          rp: {
            name: "Divly",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode("user123"), // Should be user ID in production
            name: "user@example.com",
            displayName: "Divly User",
          },
          pubKeyCredParams: [{
            type: "public-key",
            alg: -7 // ES256
          }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        saveBiometricSettings(true);
        setShowSetupDialog(false);
        onAuthSuccess?.('setup');
        
        // Store credential ID for future authentication
        const publicKeyCredential = credential as PublicKeyCredential;
        localStorage.setItem('biometric_credential_id', 
          Array.from(new Uint8Array(publicKeyCredential.rawId)).join(','));
      }
    } catch (error: any) {
      console.error('Biometric setup error:', error);
      let errorMessage = 'Failed to setup biometric authentication';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric authentication was denied or cancelled';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication is not supported';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during biometric setup';
      }
      
      onAuthError?.(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateWithBiometrics = async () => {
    if (!capabilities.isSupported || !isEnabled) {
      onAuthError?.('Biometric authentication is not available');
      return;
    }

    setIsAuthenticating(true);

    try {
      const credentialId = localStorage.getItem('biometric_credential_id');
      if (!credentialId) {
        throw new Error('No biometric credential found');
      }

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32), // Should be random in production
          allowCredentials: [{
            type: "public-key",
            id: new Uint8Array(credentialId.split(',').map(x => parseInt(x)))
          }],
          userVerification: "required",
          timeout: 60000
        }
      });

      if (credential) {
        // Determine which method was used
        let method = 'Biometric';
        if (capabilities.hasFaceID) method = 'Face ID';
        else if (capabilities.hasFingerprint) method = 'Fingerprint';

        setLastAuthMethod(method);
        onAuthSuccess?.(method);
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      let errorMessage = 'Biometric authentication failed';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric authentication was cancelled';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Biometric authentication is not properly set up';
      }
      
      onAuthError?.(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const disableBiometricAuth = () => {
    saveBiometricSettings(false);
    localStorage.removeItem('biometric_credential_id');
    setShowDisableDialog(false);
    setLastAuthMethod('');
  };

  const getBiometricIcon = () => {
    if (capabilities.hasFaceID) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    }
    
    if (capabilities.hasFingerprint) {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  };

  if (!capabilities.isSupported) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Biometric Authentication
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Not supported on this device
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isEnabled 
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
            }`}>
              {getBiometricIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Biometric Authentication
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEnabled 
                  ? `Enabled with ${capabilities.methods.join(', ')}`
                  : `Available: ${capabilities.methods.join(', ')}`
                }
              </p>
              {lastAuthMethod && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Last authenticated with {lastAuthMethod}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            {!isEnabled ? (
              <Button
                onClick={() => setShowSetupDialog(true)}
                disabled={isAuthenticating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAuthenticating ? 'Setting up...' : 'Enable'}
              </Button>
            ) : (
              <>
                <Button
                  onClick={authenticateWithBiometrics}
                  disabled={isAuthenticating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isAuthenticating ? 'Authenticating...' : 'Test Auth'}
                </Button>
                <Button
                  onClick={() => setShowDisableDialog(true)}
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Disable
                </Button>
              </>
            )}
          </div>
        </div>

        {capabilities.methods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Available Methods:
            </h4>
            <div className="flex flex-wrap gap-2">
              {capabilities.methods.map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={showSetupDialog}
        onCancel={() => setShowSetupDialog(false)}
        onConfirm={setupBiometricAuth}
        title="Setup Biometric Authentication"
        description={`Set up ${capabilities.methods.join(' or ')} for quick and secure access to your account?`}
        confirmLabel="Setup"
        cancelLabel="Cancel"
      />

      <ConfirmDialog
        open={showDisableDialog}
        onCancel={() => setShowDisableDialog(false)}
        onConfirm={disableBiometricAuth}
        title="Disable Biometric Authentication"
        description="Are you sure you want to disable biometric authentication? You'll need to use your password to sign in."
        confirmLabel="Disable"
        cancelLabel="Cancel"
      />
    </>
  );
};

export default BiometricAuth; 