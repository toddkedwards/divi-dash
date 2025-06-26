'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Check, TrendingUp, Calendar, BarChart3, Settings, Star } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
}

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('divly-onboarding-completed');
    if (seen) {
      setHasSeenOnboarding(true);
    }
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Divly',
      description: 'Your professional dividend portfolio tracker with real-time insights and AI-powered recommendations.',
      icon: <Star className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'dashboard',
      title: 'Portfolio Dashboard',
      description: 'Track your portfolio value, gains/losses, and dividend income in real-time with live market data.',
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'calendar',
      title: 'Dividend Calendar',
      description: 'Never miss a dividend payment with our comprehensive calendar showing ex-dates and payment dates.',
      icon: <Calendar className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Get deep insights into your portfolio performance, sector allocation, and dividend growth trends.',
      icon: <BarChart3 className="w-8 h-8 text-emerald-600" />
    },
    {
      id: 'settings',
      title: 'Customize Your Experience',
      description: 'Personalize your dashboard, set up alerts, and configure your preferences to match your investment style.',
      icon: <Settings className="w-8 h-8 text-emerald-600" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('divly-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen || hasSeenOnboarding) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep 
                    ? 'bg-emerald-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;