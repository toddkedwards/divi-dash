'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Star, Crown, Zap, TrendingUp, Shield, 
  Users, BarChart, Bot, Bell, Globe, Smartphone 
} from 'lucide-react';
import GoProButton from './GoProButton';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'month' | 'year';
  popular?: boolean;
  premium?: boolean;
  features: PricingFeature[];
  limitations?: string[];
}

interface PricingFeature {
  name: string;
  included: boolean;
  icon?: React.ReactNode;
  tooltip?: string;
}

interface PricingPlansProps {
  currentPlan?: string;
  onSelectPlan?: (planId: string) => void;
  showAnnualToggle?: boolean;
  compact?: boolean;
}

export default function PricingPlans({ 
  currentPlan = 'free',
  onSelectPlan,
  showAnnualToggle = true,
  compact = false
}: PricingPlansProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billingPeriod: 'month',
      features: [
        { name: 'Portfolio tracking', included: true, icon: <BarChart className="w-4 h-4" /> },
        { name: 'Dividend calendar', included: true, icon: <TrendingUp className="w-4 h-4" /> },
        { name: 'Basic analytics', included: true, icon: <BarChart className="w-4 h-4" /> },
        { name: 'CSV import/export', included: true },
        { name: 'Mobile access', included: true, icon: <Smartphone className="w-4 h-4" /> },
        { name: 'Up to 50 holdings', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'AI recommendations', included: false, icon: <Bot className="w-4 h-4" /> },
        { name: 'Real-time alerts', included: false, icon: <Bell className="w-4 h-4" /> },
        { name: 'Multiple portfolios', included: false },
        { name: 'Priority support', included: false, icon: <Shield className="w-4 h-4" /> }
      ],
      limitations: [
        'Limited to 1 portfolio',
        'Basic notification system',
        'Community support only'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnual ? 39 : 4.99,
      billingPeriod: isAnnual ? 'year' : 'month',
      popular: true,
      features: [
        { name: 'Everything in Free', included: true },
        { name: 'Advanced analytics', included: true, icon: <BarChart className="w-4 h-4" /> },
        { name: 'AI recommendations', included: true, icon: <Bot className="w-4 h-4" /> },
        { name: 'Real-time alerts', included: true, icon: <Bell className="w-4 h-4" /> },
        { name: 'Multiple portfolios', included: true },
        { name: 'Unlimited holdings', included: true },
        { name: 'Priority email support', included: true, icon: <Shield className="w-4 h-4" /> },
        { name: 'Advanced screening', included: true },
        { name: 'Portfolio optimization', included: true },
        { name: 'Custom notifications', included: true },
        { name: 'Data export (Excel/PDF)', included: true }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: isAnnual ? 89 : 9.99,
      billingPeriod: isAnnual ? 'year' : 'month',
      premium: true,
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'White-label reports', included: true, icon: <Crown className="w-4 h-4" /> },
        { name: 'API access', included: true, icon: <Globe className="w-4 h-4" /> },
        { name: 'Advanced backtesting', included: true },
        { name: 'Institutional features', included: true },
        { name: '1-on-1 advisory calls', included: true, icon: <Users className="w-4 h-4" /> },
        { name: 'Custom integrations', included: true },
        { name: 'Priority phone support', included: true, icon: <Shield className="w-4 h-4" /> },
        { name: 'Early access to features', included: true, icon: <Zap className="w-4 h-4" /> }
      ]
    }
  ];

  const getAnnualSavings = (plan: PricingPlan) => {
    if (plan.id === 'free') return 0;
    const monthlyYearly = plan.price * 12;
    const annualPrice = plan.id === 'pro' ? 39 : 89;
    return monthlyYearly - annualPrice;
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Annual/Monthly Toggle */}
      {showAnnualToggle && (
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex items-center gap-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isAnnual 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Annual
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
              plan.popular 
                ? 'border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-100 dark:ring-yellow-900/20' 
                : plan.premium
                ? 'border-purple-400 dark:border-purple-500'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${currentPlan === plan.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Most Popular
                </div>
              </div>
            )}

            {/* Premium Badge */}
            {plan.premium && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Premium
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    /{plan.billingPeriod}
                  </span>
                </div>
                
                {/* Annual Savings */}
                {isAnnual && plan.id !== 'free' && (
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Save ${getAnnualSavings(plan)} per year
                  </div>
                )}

                {/* Current Plan Badge */}
                {currentPlan === plan.id && (
                  <div className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    <Check className="w-3 h-3" />
                    Current Plan
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 ${
                      feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      feature.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'
                    }`}>
                      {feature.included ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current opacity-30" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {feature.icon}
                      <span className={`text-sm ${!feature.included ? 'line-through' : ''}`}>
                        {feature.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              {plan.limitations && plan.limitations.length > 0 && (
                <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Limitations:
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx}>• {limitation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <div className="mt-6">
                {plan.id === 'free' ? (
                  <button
                    onClick={() => onSelectPlan?.(plan.id)}
                    disabled={currentPlan === plan.id}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentPlan === plan.id ? 'Current Plan' : 'Get Started Free'}
                  </button>
                ) : currentPlan === plan.id ? (
                  <button
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <GoProButton 
                    className={`w-full ${
                      plan.premium 
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                        : ''
                    }`}
                  />
                )}
              </div>

              {/* Additional Info */}
              {plan.id !== 'free' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Cancel anytime. No hidden fees.
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature Comparison (for non-compact view) */}
      {!compact && (
        <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Need help choosing? Compare all features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">For Beginners</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start with our free plan to track basic portfolio metrics and learn about dividend investing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">For Serious Investors</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pro plan includes advanced analytics, AI recommendations, and unlimited portfolio tracking.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">For Institutions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Premium features include API access, white-label reports, and dedicated support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}