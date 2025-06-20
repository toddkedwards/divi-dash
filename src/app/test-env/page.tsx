'use client';

import { useEffect, useState } from 'react';
import app from '@/lib/firebase';

export default function TestEnv() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setEnvVars({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Environment Variables Test</h1>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="p-2 bg-gray-100 rounded">
            <span className="font-semibold">{key}:</span>{' '}
            <span className={value ? 'text-green-600' : 'text-red-600'}>
              {value || 'Not loaded'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 