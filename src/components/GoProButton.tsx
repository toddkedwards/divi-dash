"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GoProButton({ className = '' }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/signup');
      return;
    }

    setLoading(true);
    try {
      // Get the user's ID token
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/signup');
          return;
        }
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      ) : (
        <>
          <span className="mr-2">💎</span>
          {user ? 'Upgrade to Pro' : 'Sign Up for Pro'}
        </>
      )}
    </button>
  );
} 