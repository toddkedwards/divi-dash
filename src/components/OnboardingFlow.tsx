'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, DollarSign, CheckCircle } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (preferences: any) => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState({
    goals: [] as string[],
    experience: 'intermediate',
    portfolioSize: 'growing'
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Divly!',
      content: (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">Divly</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Your smart dividend portfolio tracker with AI-powered insights
          </p>
        </div>
      )
    },
    {
      title: 'Investment Goals',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What are your investment goals?</h3>
          <div className="space-y-2">
            {['Generate Income', 'Long-term Growth', 'Retirement Planning'].map((goal) => (
              <button
                key={goal}
                onClick={() => {
                  const goals = preferences.goals.includes(goal)
                    ? preferences.goals.filter(g => g !== goal)
                    : [...preferences.goals, goal];
                  setPreferences(prev => ({ ...prev, goals }));
                }}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  preferences.goals.includes(goal)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'All Set!',
      content: (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h3 className="text-xl font-bold">Welcome aboard!</h3>
          <p className="text-gray-600">Your dashboard is ready. Let's start tracking!</p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{steps[step].title}</h2>
            <button onClick={onSkip} className="text-gray-400 text-sm">Skip</button>
          </div>
          <div className="flex space-x-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${i <= step ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          {steps[step].content}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (step < steps.length - 1) {
                setStep(step + 1);
              } else {
                onComplete(preferences);
              }
            }}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}